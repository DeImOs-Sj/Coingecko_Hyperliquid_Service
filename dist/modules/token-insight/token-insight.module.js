"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInsightModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const token_insight_controller_1 = require("./token-insight.controller");
const token_insight_service_1 = require("./token-insight.service");
const coingecko_service_1 = require("./coingecko.service");
const groq_service_1 = require("./groq.service");
let TokenInsightModule = class TokenInsightModule {
};
exports.TokenInsightModule = TokenInsightModule;
exports.TokenInsightModule = TokenInsightModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [token_insight_controller_1.TokenInsightController],
        providers: [token_insight_service_1.TokenInsightService, coingecko_service_1.CoingeckoService, groq_service_1.GroqService],
        exports: [token_insight_service_1.TokenInsightService],
    })
], TokenInsightModule);
//# sourceMappingURL=token-insight.module.js.map