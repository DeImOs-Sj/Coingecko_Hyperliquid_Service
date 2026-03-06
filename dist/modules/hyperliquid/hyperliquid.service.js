"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HyperLiquidService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperLiquidService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const date_fns_1 = require("date-fns");
let HyperLiquidService = HyperLiquidService_1 = class HyperLiquidService {
    httpService;
    configService;
    baseUrl;
    logger = new common_1.Logger(HyperLiquidService_1.name);
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('HYPERLIQUID_API_BASE_URL', 'https://api.hyperliquid.xyz/info');
    }
    async fetchInfo(type, user, extra) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(this.baseUrl, {
                type,
                user,
                ...extra,
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`HyperLiquid API error: ${error.message}`);
            throw new common_1.HttpException(`HyperLiquid API error: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async getPnl(wallet, query) {
        const start = (0, date_fns_1.parseISO)(query.start);
        const end = (0, date_fns_1.parseISO)(query.end);
        const startTimeMs = start.getTime();
        const endTimeMs = end.getTime();
        const [fills, clearinghouseState] = await Promise.all([
            this.fetchInfo('userFills', wallet),
            this.fetchInfo('clearinghouseState', wallet),
        ]);
        const dailyMap = new Map();
        let currentDay = start;
        while (!(0, date_fns_1.isAfter)(currentDay, end)) {
            const dateStr = (0, date_fns_1.format)(currentDay, 'yyyy-MM-dd');
            dailyMap.set(dateStr, {
                date: dateStr,
                realized_pnl_usd: 0,
                unrealized_pnl_usd: 0,
                fees_usd: 0,
                funding_usd: 0,
                net_pnl_usd: 0,
                equity_usd: 0,
            });
            currentDay = (0, date_fns_1.addDays)(currentDay, 1);
        }
        if (fills && Array.isArray(fills)) {
            this.logger.debug(`Processing ${fills.length} fills`);
            if (fills.length > 0) {
                this.logger.debug(`Sample fill object: ${JSON.stringify(fills[0]).substring(0, 200)}`);
            }
            fills.forEach(fillObj => {
                const fill = fillObj.fill ? fillObj.fill : fillObj;
                const fillTime = new Date(Number(fill.time));
                if ((0, date_fns_1.isWithinInterval)(fillTime, { start: (0, date_fns_1.startOfDay)(start), end: (0, date_fns_1.endOfDay)(end) })) {
                    const dateStr = (0, date_fns_1.format)(fillTime, 'yyyy-MM-dd');
                    const stats = dailyMap.get(dateStr);
                    if (stats) {
                        stats.realized_pnl_usd += parseFloat(fill.closedPnl || '0');
                        stats.fees_usd += parseFloat(fill.fee || '0');
                    }
                }
            });
        }
        const todayStr = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
        const endStr = (0, date_fns_1.format)(end, 'yyyy-MM-dd');
        if (dailyMap.has(endStr) && endStr === todayStr && clearinghouseState?.assetPositions) {
            let totalUnrealized = 0;
            clearinghouseState.assetPositions.forEach(pos => {
                totalUnrealized += parseFloat(pos.position.unrealizedPnl || '0');
            });
            const stats = dailyMap.get(endStr);
            stats.unrealized_pnl_usd = totalUnrealized;
        }
        const result = Array.from(dailyMap.values());
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
};
exports.HyperLiquidService = HyperLiquidService;
exports.HyperLiquidService = HyperLiquidService = HyperLiquidService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], HyperLiquidService);
//# sourceMappingURL=hyperliquid.service.js.map