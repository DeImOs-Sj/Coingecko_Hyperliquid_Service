import { CoingeckoService } from './coingecko.service';
import { GroqService } from './groq.service';
import { TokenInsightDto } from './dto/token-insight.dto';
export declare class TokenInsightService {
    private readonly coingecko;
    private readonly groq;
    private readonly logger;
    constructor(coingecko: CoingeckoService, groq: GroqService);
    getInsight(id: string, dto: TokenInsightDto): Promise<{
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
