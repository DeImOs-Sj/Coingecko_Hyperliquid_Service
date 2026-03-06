import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Token Insight & Analytics API')
    .setDescription('Assignment API for Token Insights (CoinGecko + Groq) and HyperLiquid Wallet PnL')
    .setVersion('1.0')
    .addTag('token')
    .addTag('hyperliquid')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
