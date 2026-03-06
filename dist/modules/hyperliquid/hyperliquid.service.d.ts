import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HyperLiquidPnlDto } from './dto/hyperliquid-pnl.dto';
export declare class HyperLiquidService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService);
    private fetchInfo;
    getPnl(wallet: string, query: HyperLiquidPnlDto): Promise<{
        wallet: string;
        start: string;
        end: string;
        daily: any[];
        pagination: {
            total_days: number;
            current_page: number;
            limit: number;
            total_pages: number;
        };
        summary: {
            total_realized_usd: number;
            total_unrealized_usd: number;
            total_fees_usd: number;
            total_funding_usd: number;
            net_pnl_usd: number;
        };
        diagnostics: {
            data_source: string;
            last_api_call: string;
            notes: string;
        };
    }>;
}
