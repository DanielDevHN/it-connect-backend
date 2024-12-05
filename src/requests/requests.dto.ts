import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, ArrayNotEmpty, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';

export class CreateRequestDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    categories: number[];
    
    @ApiProperty()
    @IsInt()
    requestorId: number;
    
    @ApiProperty()
    @IsOptional()
    @IsInt()
    assigneeId?: number;

    @ApiProperty()
    @IsDateString()
    plannedForDate: Date;
}

export class UpdateRequestDto extends CreateRequestDto {
    @ApiProperty()
    @IsInt()
    id: number;

    @ApiProperty({ enum: RequestStatus })
    @IsOptional()
    @IsEnum(RequestStatus)
    status: RequestStatus;

    @ApiProperty()
    @IsDateString()
    updatedAt: Date;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    resolvedAt: Date;
}

export class AssignRequestDto {
    @IsInt()
    assigneeId: number;
}