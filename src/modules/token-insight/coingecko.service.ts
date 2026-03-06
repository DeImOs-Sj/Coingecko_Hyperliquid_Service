import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoingeckoService {
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('COINGECKO_API_BASE_URL', 'https://api.coingecko.com/api/v3');
    }

    async getTokenData(id: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
            );
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            throw new HttpException(
                `Failed to fetch token data for ${id}: ${error.response?.data?.error || error.message}`,
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getMarketHistory(id: string, vsCurrency: string, days: number) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/coins/${id}/market_chart?vs_currency=${vsCurrency}&days=${days}`)
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            // We can return null or empty if history is not available, but let's try to fetch it.
            return null;
        }
    }
}
