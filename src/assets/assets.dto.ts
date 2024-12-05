import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, IsArray, ArrayNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssetStatus, AssetType } from '@prisma/client';

export class CreateAssetDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(AssetType)
    type: AssetType;

    @ApiProperty()
    @IsOptional()
    @IsEnum(AssetStatus)
    status: AssetStatus;
    
    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    categories: number[];
    
    @ApiProperty()
    @IsOptional()
    @IsInt()
    ownerId: number;

    @ApiProperty()
    @IsDateString()
    purchasedAt: Date;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    warrantyExpiresAt: Date;

    @ApiProperty()
    @IsDateString()
    createdAt: Date;
}

export class UpdateAssetDto extends CreateAssetDto{
    @ApiProperty()
    @IsInt()
    id: number;

    @ApiProperty()
    @IsDateString()
    updatedAt: Date;
}

export class AssignIncidentDto {
    @IsInt()
    assigneeId: number;
}
