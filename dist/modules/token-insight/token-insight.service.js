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
var TokenInsightService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInsightService = void 0;
const common_1 = require("@nestjs/common");
const coingecko_service_1 = require("./coingecko.service");
const groq_service_1 = require("./groq.service");
let TokenInsightService = TokenInsightService_1 = class TokenInsightService {
    coingecko;
    groq;
    logger = new common_1.Logger(TokenInsightService_1.name);
    constructor(coingecko, groq) {
        this.coingecko = coingecko;
        this.groq = groq;
    }
    async getInsight(id, dto) {
        const vs_currency = dto.vs_currency || 'usd';
        const history_days = dto.history_days || 30;
        const [tokenMetadata, marketHistory] = await Promise.all([
            this.coingecko.getTokenData(id),
            this.coingecko.getMarketHistory(id, vs_currency, history_days),
        ]);
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
        const insight = await this.groq.generateInsight(prompt);
        const modelInfo = await this.groq.getModelInfo();
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
};
exports.TokenInsightService = TokenInsightService;
exports.TokenInsightService = TokenInsightService = TokenInsightService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [coingecko_service_1.CoingeckoService,
        groq_service_1.GroqService])
], TokenInsightService);
//# sourceMappingURL=token-insight.service.js.map