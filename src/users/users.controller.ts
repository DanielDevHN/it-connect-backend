import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { ApiBody } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt'

@Controller('users')
export class UsersController {
    constructor(private usersService:UsersService){}
    
    @Get()
    getUsers() {
        return this.usersService.findAll();
    }

    @Get(':id')
    getUser(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }

    @Post()
    @ApiBody({type: CreateUserDto})
    async createUser(@Body() user:CreateUserDto) {
        user.password = await bcrypt.hash(user.password, 10);
        return this.usersService.createUser(user);
    }

    @Put()
    @ApiBody({type: UpdateUserDto})
    async updateUser(@Body() user:UpdateUserDto) {
        return this.usersService.putUser(user);
    }

    @Delete(':id')
    async deleteUser(@Param('id') userId: number) {
        return this.usersService.deleteUser(userId);
    }
}
