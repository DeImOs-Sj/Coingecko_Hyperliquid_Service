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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GroqService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
let GroqService = GroqService_1 = class GroqService {
    configService;
    groq = null;
    logger = new common_1.Logger(GroqService_1.name);
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey || apiKey === 'your_groq_api_key_here') {
            this.logger.warn('GROQ_API_KEY is not defined or is placeholder. AI insights will not work.');
            this.groq = null;
        }
        else {
            this.groq = new groq_sdk_1.default({ apiKey });
        }
    }
    async generateInsight(prompt) {
        if (!this.groq) {
            return {
                reasoning: "AI insights are currently disabled (missing API key).",
                sentiment: "Neutral"
            };
        }
        try {
            const chatCompletion = await this.groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
            });
            const content = chatCompletion.choices[0].message.content;
            if (!content) {
                throw new Error('Groq AI returned empty content');
            }
            return JSON.parse(content);
        }
        catch (error) {
            this.logger.error(`Groq API call failed: ${error.message}`);
            return {
                reasoning: "Failed to generate AI insight due to an error.",
                sentiment: "Unknown"
            };
        }
    }
    async getModelInfo() {
        return { provider: 'groq', model: 'llama-3.3-70b-versatile' };
    }
};
exports.GroqService = GroqService;
exports.GroqService = GroqService = GroqService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GroqService);
//# sourceMappingURL=groq.service.js.map