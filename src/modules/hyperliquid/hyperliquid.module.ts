import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HyperLiquidController } from './hyperliquid.controller';
import { HyperLiquidService } from './hyperliquid.service';

@Module({
    imports: [HttpModule],
    controllers: [HyperLiquidController],
    providers: [HyperLiquidService],
    exports: [HyperLiquidService],
})
export class HyperLiquidModule { }
