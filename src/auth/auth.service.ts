import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        try {
            // Find the user by email
            const user = await this.prismaService.user.findUnique({
                where: { email },
            });
            
            
            if (!user) {
                throw new HttpException(
                    'Invalid email or password.',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            // Compare the password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new HttpException(
                    'Invalid email or password.',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            // Generate JWT token
            const payload = { sub: user.id, email: user.email };
            const token = this.jwtService.sign(payload);

            // Exclude password from response
            const { password: userPassword, ...userWithoutPassword } = user;
            // console.log('User:', user);

            return {
                user: userWithoutPassword,
                token,
            };
        } catch (error) {
            // Check if the error is an instance of HttpException
            if (error instanceof HttpException) {
                throw error; // Re-throw known HttpExceptions
            }

            // Handle unexpected errors
            throw new HttpException(
                'An error occurred while logging in.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async changePassword(userId: number, currentPassword: string, newPassword: string) {
        try {
            // Fetch the user by ID
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });
    
            if (!user) {
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }
    
            // Verify the current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
            if (!isPasswordValid) {
                throw new HttpException(
                    'Current password is incorrect.',
                    HttpStatus.UNAUTHORIZED,
                );
            }
    
            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
            // Update the user's password in the database
            await this.prismaService.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword },
            });
    
            return { message: 'Password updated successfully.' };
        } catch (error) {
            throw new HttpException(
                'An error occurred while changing the password.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    
    async resetPassword(userId: number, newPassword: string) {
        try {
            // Fetch the user by ID
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });
    
            if (!user) {
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }
    
            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
            // Update the user's password in the database
            await this.prismaService.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword },
            });
    
            return { message: 'Password updated successfully.' };
        } catch (error) {
            throw new HttpException(
                'An error occurred while resetting the password.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    
}
