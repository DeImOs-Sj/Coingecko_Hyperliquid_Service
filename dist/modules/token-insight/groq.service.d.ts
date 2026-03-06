import { ConfigService } from '@nestjs/config';
export declare class GroqService {
    private readonly configService;
    private readonly groq;
    private readonly logger;
    constructor(configService: ConfigService);
    generateInsight(prompt: string): Promise<any>;
    getModelInfo(): Promise<{
        provider: string;
        model: string;
    }>;
}
