import { IsString,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseCategoryDto {
    @ApiProperty()
    @IsString()
    name: string;
}

export class UpdateCategoryDto extends BaseCategoryDto {
    @ApiProperty()
    @IsNumber()
    id: number;
}