import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HyperLiquidPnlDto } from './dto/hyperliquid-pnl.dto';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isAfter, isBefore, addDays, differenceInDays } from 'date-fns';

@Injectable()
export class HyperLiquidService {
    private readonly baseUrl: string;
    private readonly logger = new Logger(HyperLiquidService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('HYPERLIQUID_API_BASE_URL', 'https://api.hyperliquid.xyz/info');
    }

    private async fetchInfo(type: string, user: string, extra?: any): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(this.baseUrl, {
                    type,
                    user,
                    ...extra,
                })
            );
            return response.data;
        } catch (error) {
            this.logger.error(`HyperLiquid API error: ${error.message}`);
            throw new HttpException(
                `HyperLiquid API error: ${error.message}`,
                HttpStatus.BAD_GATEWAY,
            );
        }
    }

    async getPnl(wallet: string, query: HyperLiquidPnlDto) {
        const start = parseISO(query.start);
        const end = parseISO(query.end);
        const startTimeMs = start.getTime();
        const endTimeMs = end.getTime();

        // 1. Fetch user fills for the time range (or full history to reconstruct)
        // HyperLiquid userFills endpoint doesn't support time filter directly in POST, 
        // but some stats-data endpoints do. Let's use userFills and filter locally or use a historical snapshot.
        const [fills, clearinghouseState] = await Promise.all([
            this.fetchInfo('userFills', wallet),
            this.fetchInfo('clearinghouseState', wallet),
        ]);

        // 2. Aggregate data by day
        const dailyMap = new Map<string, any>();

        // Fill the daily map for each day in range to ensure continuity
        let currentDay = start;
        while (!isAfter(currentDay, end)) {
            const dateStr = format(currentDay, 'yyyy-MM-dd');
            dailyMap.set(dateStr, {
                date: dateStr,
                realized_pnl_usd: 0,
                unrealized_pnl_usd: 0,
                fees_usd: 0,
                funding_usd: 0,
                net_pnl_usd: 0,
                equity_usd: 0,
            });
            currentDay = addDays(currentDay, 1);
        }

        // Process fills (realized pnl and fees)
        if (fills && Array.isArray(fills)) {
            this.logger.debug(`Processing ${fills.length} fills`);
            if (fills.length > 0) {
                this.logger.debug(`Sample fill object: ${JSON.stringify(fills[0]).substring(0, 200)}`);
            }
            fills.forEach(fillObj => {
                // Some HL endpoints nest the fill data
                const fill = fillObj.fill ? fillObj.fill : fillObj;
                const fillTime = new Date(Number(fill.time));

                if (isWithinInterval(fillTime, { start: startOfDay(start), end: endOfDay(end) })) {
                    const dateStr = format(fillTime, 'yyyy-MM-dd');
                    const stats = dailyMap.get(dateStr);
                    if (stats) {
                        stats.realized_pnl_usd += parseFloat(fill.closedPnl || '0');
                        stats.fees_usd += parseFloat(fill.fee || '0');
                    }
                }
            });
        }

        // Unrealized PnL is tricky for historical days via public API without snapshots.
        // For this simulation/assignment, we will use's current unrealized if it matches current day
        // or estimate based on pnlHistory (if it were available in this public API version)
        // As a demonstration, we will assign current unrealized to the 'end' day if today.
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const endStr = format(end, 'yyyy-MM-dd');

        if (dailyMap.has(endStr) && endStr === todayStr && clearinghouseState?.assetPositions) {
            let totalUnrealized = 0;
            clearinghouseState.assetPositions.forEach(pos => {
                totalUnrealized += parseFloat(pos.position.unrealizedPnl || '0');
            });
            const stats = dailyMap.get(endStr);
            stats.unrealized_pnl_usd = totalUnrealized;
        }

        // Calculate Net PnL and totals
        const result = Array.from(dailyMap.values());

        // Sort descending to show most recent first
        result.sort((a, b) => b.date.localeCompare(a.date));

        let totalRealized = 0;
        let totalUnrealized = 0;
        let totalFees = 0;
        let totalFunding = 0;

        result.forEach(day => {
            day.net_pnl_usd = day.realized_pnl_usd + day.unrealized_pnl_usd - day.fees_usd + day.funding_usd;
            totalRealized += day.realized_pnl_usd;
            totalUnrealized += day.unrealized_pnl_usd;
            totalFees += day.fees_usd;
            totalFunding += day.funding_usd;
        });

        // Pagination
        const page = query.page || 1;
        const limit = query.limit || 10;
        const startIndex = (page - 1) * limit;
        const paginatedDaily = result.slice(startIndex, startIndex + limit);

        return {
            wallet,
            start: query.start,
            end: query.end,
            daily: paginatedDaily,
            pagination: {
                total_days: result.length,
                current_page: page,
                limit: limit,
                total_pages: Math.ceil(result.length / limit),
            },
            summary: {
                total_realized_usd: totalRealized,
                total_unrealized_usd: totalUnrealized,
                total_fees_usd: totalFees,
                total_funding_usd: totalFunding,
                net_pnl_usd: totalRealized + totalUnrealized - totalFees + totalFunding,
            },
            diagnostics: {
                data_source: 'hyperliquid_api',
                last_api_call: new Date().toISOString(),
                notes: 'Historical unrealized PnL requires position snapshots, using current state for current day.',
            },
        };
    }
}
