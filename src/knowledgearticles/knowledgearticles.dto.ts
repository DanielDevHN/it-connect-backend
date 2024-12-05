import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsNumber, IsPhoneNumber, IsString, IsUrl, IsArray, ArrayNotEmpty, IsOptional } from "class-validator";

class BaseKnowledgearticleDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsUrl()
    docUrl: string;
    
    
    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    categories: number[];
    
    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    assets: number[];
    
    @ApiProperty()
    @IsDateString()
    createdAt: Date;
}

export class CreateKnowledgearticleDto extends BaseKnowledgearticleDto {
    @ApiProperty()
    @IsNumber()
    createdById: number;

    @ApiProperty()
    @IsDateString()
    createdAt: Date;

    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    categories: number[];

    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    assets: number[];
}

export class UpdateKnowledgearticleDto extends CreateKnowledgearticleDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsDateString()
    updatedAt: Date;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    lastModifiedById: number;

    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    categories: number[];

    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    assets: number[];
}