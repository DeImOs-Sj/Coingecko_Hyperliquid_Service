import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { GroqService } from './groq.service';
import { TokenInsightDto } from './dto/token-insight.dto';

@Injectable()
export class TokenInsightService {
    private readonly logger = new Logger(TokenInsightService.name);

    constructor(
        private readonly coingecko: CoingeckoService,
        private readonly groq: GroqService,
    ) { }

    async getInsight(id: string, dto: TokenInsightDto) {
        const vs_currency = dto.vs_currency || 'usd';
        const history_days = dto.history_days || 30;

        // 1. Fetch metadata & market data
        const [tokenMetadata, marketHistory] = await Promise.all([
            this.coingecko.getTokenData(id),
            this.coingecko.getMarketHistory(id, vs_currency, history_days),
        ]);

        // Format current data safely
        const marketData = tokenMetadata.market_data;
        const currentPrice = marketData?.current_price?.[vs_currency] || 0;
        const marketCap = marketData?.market_cap?.[vs_currency] || 0;
        const totalVolume = marketData?.total_volume?.[vs_currency] || 0;
        const priceChange24h = marketData?.price_change_percentage_24h || 0;

        const formattedData = {
            id,
            symbol: tokenMetadata.symbol,
            name: tokenMetadata.name,
            description: tokenMetadata.description?.en?.slice(0, 500) || '',
            current_price: currentPrice,
            market_cap: marketCap,
            total_volume: totalVolume,
            price_change_24h: priceChange24h,
            high_24h: marketData?.high_24h?.[vs_currency] || 0,
            low_24h: marketData?.low_24h?.[vs_currency] || 0,
        };

        // 2. Build structured prompt
        const prompt = `
      As an expert crypto analyst, analyze the following token and market data for ${formattedData.name} (${formattedData.symbol.toUpperCase()}):
      Current Price: ${currentPrice} ${vs_currency.toUpperCase()}
      Market Cap: ${marketCap} ${vs_currency.toUpperCase()}
      24h Volume: ${totalVolume} ${vs_currency.toUpperCase()}
      24h Price Change: ${priceChange24h}%
      Description: ${formattedData.description}

      Based on this data, provide a structured JSON response with:
      1. Reasoning: A concise expert analysis of current market standing and potential risks/opportunities.
      2. Sentiment: Choose from Bullish, Bearish, or Neutral.
      Format: { "reasoning": "...", "sentiment": "..." }
    `;

        // 3. Call AI
        const insight = await this.groq.generateInsight(prompt);
        const modelInfo = await this.groq.getModelInfo();

        // 4. Return combined output
        return {
            source: 'coingecko',
            token: {
                id: formattedData.id,
                symbol: formattedData.symbol,
                name: formattedData.name,
                market_data: {
                    [`current_price_${vs_currency}`]: currentPrice,
                    [`market_cap_${vs_currency}`]: marketCap,
                    [`total_volume_${vs_currency}`]: totalVolume,
                    price_change_percentage_24h: priceChange24h,
                },
            },
            insight,
            model: modelInfo,
        };
    }
}
