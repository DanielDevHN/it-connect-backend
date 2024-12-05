import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

class BaseUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiProperty()
    @IsDateString()
    createdAt: Date;
}

export class CreateUserDto extends BaseUserDto {
    @ApiProperty()
    @IsString()
    password: string;
}

export class UpdateUserDto extends BaseUserDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsDateString()
    updatedAt: Date;
}