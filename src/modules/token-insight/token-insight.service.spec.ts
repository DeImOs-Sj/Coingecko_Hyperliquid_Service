import { Test, TestingModule } from '@nestjs/testing';
import { TokenInsightService } from './token-insight.service';
import { CoingeckoService } from './coingecko.service';
import { GroqService } from './groq.service';

describe('TokenInsightService', () => {
    let service: TokenInsightService;
    let coingeckoService: jest.Mocked<CoingeckoService>;
    let groqService: jest.Mocked<GroqService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenInsightService,
                {
                    provide: CoingeckoService,
                    useValue: {
                        getTokenData: jest.fn(),
                        getMarketHistory: jest.fn(),
                    },
                },
                {
                    provide: GroqService,
                    useValue: {
                        generateInsight: jest.fn(),
                        getModelInfo: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TokenInsightService>(TokenInsightService);
        coingeckoService = module.get(CoingeckoService);
        groqService = module.get(GroqService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return combined insight data', async () => {
        const mockTokenData = {
            name: 'Chainlink',
            symbol: 'link',
            description: { en: 'Chainlink is a decentralized oracle network.' },
            market_data: {
                current_price: { usd: 7.23 },
                market_cap: { usd: 3500000000 },
                total_volume: { usd: 120000000 },
                price_change_percentage_24h: -1.2,
                high_24h: { usd: 7.5 },
                low_24h: { usd: 7.0 },
            },
        };

        const mockInsight = { reasoning: 'Valid market analysis', sentiment: 'Neutral' };
        const mockModelInfo = { provider: 'groq', model: 'llama-3.3-70b-versatile' };

        coingeckoService.getTokenData.mockResolvedValue(mockTokenData);
        coingeckoService.getMarketHistory.mockResolvedValue({});
        groqService.generateInsight.mockResolvedValue(mockInsight);
        groqService.getModelInfo.mockResolvedValue(mockModelInfo);

        const result = await service.getInsight('chainlink', { vs_currency: 'usd', history_days: 30 });
        console.log(result);

        expect(result).toBeDefined();
        expect(result.token.id).toBe('chainlink');
        expect(result.insight.sentiment).toBe('Neutral');
        expect(result.model.provider).toBe('groq');
    });
});
