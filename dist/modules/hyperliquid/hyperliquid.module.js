"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperLiquidModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const hyperliquid_controller_1 = require("./hyperliquid.controller");
const hyperliquid_service_1 = require("./hyperliquid.service");
let HyperLiquidModule = class HyperLiquidModule {
};
exports.HyperLiquidModule = HyperLiquidModule;
exports.HyperLiquidModule = HyperLiquidModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [hyperliquid_controller_1.HyperLiquidController],
        providers: [hyperliquid_service_1.HyperLiquidService],
        exports: [hyperliquid_service_1.HyperLiquidService],
    })
], HyperLiquidModule);
//# sourceMappingURL=hyperliquid.module.js.map