import { TokenInsightService } from './token-insight.service';
import { TokenInsightDto } from './dto/token-insight.dto';
export declare class TokenInsightController {
    private readonly tokenInsightService;
    constructor(tokenInsightService: TokenInsightService);
    getInsight(id: string, tokenInsightDto: TokenInsightDto): Promise<{
        source: string;
        token: {
            id: string;
            symbol: any;
            name: any;
            market_data: {
                [x: string]: any;
                price_change_percentage_24h: any;
            };
        };
        insight: any;
        model: {
            provider: string;
            model: string;
        };
    }>;
}
