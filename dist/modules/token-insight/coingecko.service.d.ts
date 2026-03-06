import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class CoingeckoService {
    private readonly httpService;
    private readonly configService;
    private readonly baseUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    getTokenData(id: string): Promise<any>;
    getMarketHistory(id: string, vsCurrency: string, days: number): Promise<any>;
}
