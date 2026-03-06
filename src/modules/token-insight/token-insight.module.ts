import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TokenInsightController } from './token-insight.controller';
import { TokenInsightService } from './token-insight.service';
import { CoingeckoService } from './coingecko.service';
import { GroqService } from './groq.service';

@Module({
    imports: [HttpModule],
    controllers: [TokenInsightController],
    providers: [TokenInsightService, CoingeckoService, GroqService],
    exports: [TokenInsightService],
})
export class TokenInsightModule { }
