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
exports.HyperLiquidController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hyperliquid_service_1 = require("./hyperliquid.service");
const hyperliquid_pnl_dto_1 = require("./dto/hyperliquid-pnl.dto");
let HyperLiquidController = class HyperLiquidController {
    hyperLiquidService;
    constructor(hyperLiquidService) {
        this.hyperLiquidService = hyperLiquidService;
    }
    async getPnl(wallet, query) {
        return this.hyperLiquidService.getPnl(wallet, query);
    }
};
exports.HyperLiquidController = HyperLiquidController;
__decorate([
    (0, common_1.Get)(':wallet/pnl'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate daily PnL (realized/unrealized) for a HyperLiquid wallet' }),
    (0, swagger_1.ApiParam)({ name: 'wallet', description: 'Wallet address (0x...)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daily PnL calculated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid wallet address or date range' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Failed to fetch HyperLiquid data' }),
    __param(0, (0, common_1.Param)('wallet')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hyperliquid_pnl_dto_1.HyperLiquidPnlDto]),
    __metadata("design:returntype", Promise)
], HyperLiquidController.prototype, "getPnl", null);
exports.HyperLiquidController = HyperLiquidController = __decorate([
    (0, swagger_1.ApiTags)('hyperliquid'),
    (0, common_1.Controller)('api/hyperliquid'),
    __metadata("design:paramtypes", [hyperliquid_service_1.HyperLiquidService])
], HyperLiquidController);
//# sourceMappingURL=hyperliquid.controller.js.map