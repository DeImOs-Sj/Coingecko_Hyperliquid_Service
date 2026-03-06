import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class GroqService {
    private readonly groq: Groq | null = null;
    private readonly logger = new Logger(GroqService.name);

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        if (!apiKey || apiKey === 'your_groq_api_key_here') {
            this.logger.warn('GROQ_API_KEY is not defined or is placeholder. AI insights will not work.');
            this.groq = null;
        } else {
            this.groq = new Groq({ apiKey });
        }
    }

    async generateInsight(prompt: string): Promise<any> {
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
        } catch (error:any) {
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
}
