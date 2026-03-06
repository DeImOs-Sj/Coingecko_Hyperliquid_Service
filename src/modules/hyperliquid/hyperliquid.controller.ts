import { Controller, Get, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { HyperLiquidService } from './hyperliquid.service';
import { HyperLiquidPnlDto } from './dto/hyperliquid-pnl.dto';

@ApiTags('hyperliquid')
@Controller('api/hyperliquid')
export class HyperLiquidController {
    constructor(private readonly hyperLiquidService: HyperLiquidService) { }

    @Get(':wallet/pnl')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Calculate daily PnL (realized/unrealized) for a HyperLiquid wallet' })
    @ApiParam({ name: 'wallet', description: 'Wallet address (0x...)' })
    @ApiResponse({ status: 200, description: 'Daily PnL calculated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid wallet address or date range' })
    @ApiResponse({ status: 500, description: 'Failed to fetch HyperLiquid data' })
    async getPnl(
        @Param('wallet') wallet: string,
        @Query() query: HyperLiquidPnlDto,
    ) {
        return this.hyperLiquidService.getPnl(wallet, query);
    }
}
