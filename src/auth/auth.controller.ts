import { Controller, Post, Body, UseGuards, Patch, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Patch('change-password')
    async changePassword(
        @Request() req, // Extract the user ID from the JWT payload
        @Body('currentPassword') currentPassword: string,
        @Body('newPassword') newPassword: string,
    ) {
        const userId = req.user.sub; // Assumes `sub` contains the user ID
        return this.authService.changePassword(userId, currentPassword, newPassword);
    }

    @UseGuards(JwtAuthGuard) // Protect this route
    @Patch('reset-password/:id') // Admins or users with specific permissions can access this
    async resetPassword(
        @Param('id') userId: string, // User ID passed as a route parameter
        @Body('newPassword') newPassword: string,
    ) {
        return this.authService.resetPassword(Number(userId), newPassword);
    }
}
