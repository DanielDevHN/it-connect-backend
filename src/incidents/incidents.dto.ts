import { IsNotEmpty, IsString, IsOptional, IsEnum, IsInt, IsArray, ArrayNotEmpty, IsDateString } from 'class-validator';
// import { IncidentPriority, IncidentStatus } from './incidents.enums';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentPriority, IncidentStatus } from '@prisma/client';

export class CreateIncidentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @ApiProperty({ enum: IncidentPriority })
    @IsOptional()
    @IsEnum(IncidentPriority)
    priority: IncidentPriority;

    // Modify to allow an array of category IDs, assuming categories are passed as IDs
    @ApiProperty({ type: [Number], isArray: true })
    @IsArray()
    @ArrayNotEmpty() // Ensures the array is not empty
    categories: number[]; // List of category IDs for the incident

    @ApiProperty()
    @IsInt()
    reporterId: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    assetId: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    assigneeId: number;

    @ApiProperty()
    @IsDateString()
    createdAt: Date;
}

export class UpdateIncidentDto extends CreateIncidentDto {
    @ApiProperty()
    @IsInt()
    id: number;

    @ApiProperty({ enum: IncidentStatus })
    @IsOptional()
    @IsEnum(IncidentStatus)
    status: IncidentStatus;
    
    @ApiProperty()
    @IsDateString()
    updatedAt: Date;
    
    @ApiProperty()
    @IsOptional()
    @IsDateString()
    resolvedAt: Date;
}

export class CreateCommentDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string; // The content of the comment
  
    @ApiProperty()
    @IsInt()
    userId: number; // The ID of the user posting the comment
  
    @ApiProperty()
    @IsInt()
    incidentId: number; // The ID of the incident the comment is related to
  
    @ApiProperty()
    @IsDateString()
    createdAt: string; // The timestamp when the comment was created
}