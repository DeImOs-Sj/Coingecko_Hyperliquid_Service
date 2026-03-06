import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class TokenInsightDto {
    @ApiPropertyOptional({ description: 'Currency to compare against', default: 'usd' })
    @IsOptional()
    @IsString()
    vs_currency?: string = 'usd';

    @ApiPropertyOptional({ description: 'Number of history days to fetch', default: 30 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => Number(value))
    history_days?: number = 30;
}
