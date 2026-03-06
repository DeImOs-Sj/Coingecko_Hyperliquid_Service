import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class HyperLiquidPnlDto {
    @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
    @IsDateString()
    @IsNotEmpty()
    start: string;

    @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
    @IsDateString()
    @IsNotEmpty()
    end: string;

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => Number(value))
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => Number(value))
    limit?: number = 10;
}
