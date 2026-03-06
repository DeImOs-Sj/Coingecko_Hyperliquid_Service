"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3000);
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Token Insight & Analytics API')
        .setDescription('Assignment API for Token Insights (CoinGecko + Groq) and HyperLiquid Wallet PnL')
        .setVersion('1.0')
        .addTag('token')
        .addTag('hyperliquid')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map