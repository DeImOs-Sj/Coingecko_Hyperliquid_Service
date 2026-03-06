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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInsightController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const token_insight_service_1 = require("./token-insight.service");
const token_insight_dto_1 = require("./dto/token-insight.dto");
let TokenInsightController = class TokenInsightController {
    tokenInsightService;
    constructor(tokenInsightService) {
        this.tokenInsightService = tokenInsightService;
    }
    async getInsight(id, tokenInsightDto) {
        return this.tokenInsightService.getInsight(id, tokenInsightDto);
    }
};
exports.TokenInsightController = TokenInsightController;
__decorate([
    (0, common_1.Post)(':id/insight'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch token metadata, market history and generate AI analysis insights' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'CoinGecko token ID (e.g., chainlink, btc, eth)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token insight generated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid token ID or currency' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to generate insight' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, token_insight_dto_1.TokenInsightDto]),
    __metadata("design:returntype", Promise)
], TokenInsightController.prototype, "getInsight", null);
exports.TokenInsightController = TokenInsightController = __decorate([
    (0, swagger_1.ApiTags)('token'),
    (0, common_1.Controller)('api/token'),
    __metadata("design:paramtypes", [token_insight_service_1.TokenInsightService])
], TokenInsightController);
//# sourceMappingURL=token-insight.controller.js.map