import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenInsightModule } from './modules/token-insight/token-insight.module';
import { HyperLiquidModule } from './modules/hyperliquid/hyperliquid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TokenInsightModule,
    HyperLiquidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
