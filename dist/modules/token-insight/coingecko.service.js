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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoingeckoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let CoingeckoService = class CoingeckoService {
    httpService;
    configService;
    baseUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.baseUrl = this.configService.get('COINGECKO_API_BASE_URL', 'https://api.coingecko.com/api/v3');
    }
    async getTokenData(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`));
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to fetch token data for ${id}: ${error.response?.data?.error || error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMarketHistory(id, vsCurrency, days) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}`));
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            return null;
        }
    }
};
exports.CoingeckoService = CoingeckoService;
exports.CoingeckoService = CoingeckoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], CoingeckoService);
//# sourceMappingURL=coingecko.service.js.map