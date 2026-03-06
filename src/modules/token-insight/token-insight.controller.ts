import { Controller, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TokenInsightService } from './token-insight.service';
import { TokenInsightDto } from './dto/token-insight.dto';

@ApiTags('token')
@Controller('api/token')
export class TokenInsightController {
    constructor(private readonly tokenInsightService: TokenInsightService) { }

    @Post(':id/insight')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Fetch token metadata, market history and generate AI analysis insights' })
    @ApiParam({ name: 'id', description: 'CoinGecko token ID (e.g., chainlink, btc, eth)' })
    @ApiResponse({ status: 200, description: 'Token insight generated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid token ID or currency' })
    @ApiResponse({ status: 500, description: 'Failed to generate insight' })
    async getInsight(
        @Param('id') id: string,
        @Body() tokenInsightDto: TokenInsightDto,
    ) {
        return this.tokenInsightService.getInsight(id, tokenInsightDto);
    }
}
