import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async createUser(user: CreateUserDto) {
        try {
            if (!user.password) {
                throw new HttpException(
                    'Password is required for creating a new user.',
                    HttpStatus.BAD_REQUEST,
                );
            }
    
            const createdUser = await this.prismaService.user.create({
                data: { ...user },
            });
    
            // Exclude password from the response
            const { password, ...userWithoutPassword } = createdUser;
            return userWithoutPassword;
        } catch (error) {
            console.log(error, 'error');
            if (error.code === 'P2002') {
                // Unique constraint error
                throw new HttpException(
                    `A user with this email already exists.`,
                    HttpStatus.CONFLICT,
                );
            }
    
            throw new HttpException(
                'An error occurred while creating the user.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async putUser(user: CreateUserDto | UpdateUserDto) {
        try {
            // Define the where condition
            const whereCondition = user instanceof UpdateUserDto ? { id: user.id } : { email: user.email };

            let userPassword = '';

            if (user instanceof UpdateUserDto) {
                // Fetch the existing user to retain their password if not updated
                const existingUser = await this.prismaService.user.findUnique({
                    where: whereCondition,
                    select: { password: true },
                });
    
                if (existingUser) {
                    userPassword = existingUser.password;
                } else {
                    throw new HttpException(
                        `User with ID ${user.id} not found.`,
                        HttpStatus.NOT_FOUND,
                    );
                }
            } else if (!user.password) {
                // Generate a default password or throw an error for new users
                throw new HttpException(
                    'Password is required for creating a new user.',
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                userPassword = user.password;
            }
    
            const upsertedUser = await this.prismaService.user.upsert({
                where: whereCondition,
                create: { ...user, password: userPassword } as CreateUserDto,
                update: { ...user, password: userPassword },
            });
    
            // Exclude password from the response
            const { password, ...userWithoutPassword } = upsertedUser;
            return userWithoutPassword;
        } catch (error) {
            console.log(error, 'error');
            if (error.code === 'P2002') {
                // Unique constraint error
                throw new HttpException(
                    `A user with this email already exists.`,
                    HttpStatus.CONFLICT,
                );
            }
    
            throw new HttpException(
                'An error occurred while processing the user.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll() {
        try {
            const users = await this.prismaService.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true
                    // Exclude password
                },
            });
            return users;
        } catch (error) {
            console.log('findAll Error:', error); 
            throw new HttpException(
                'An error occurred while retrieving users.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                    // Exclude password
                },
            });
    
            if (!user) {
                throw new HttpException(
                    `User with ID ${id} not found.`,
                    HttpStatus.NOT_FOUND,
                );
            }
    
            return user;
        } catch (error) {
            if (error.status == 404) {
                throw error
            }

            throw new HttpException(
                'An error occurred while retrieving the user.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async deleteUser(userId: number) {
        try {
            // Delete user by ID
            const deletedUser = await this.prismaService.user.delete({
                where: {
                    id: userId,
                },
            });

            // Return the deleted user information, excluding the password
            const { password, ...deletedUserWithoutPassword } = deletedUser;
            return deletedUserWithoutPassword;
        } catch (error) {
            if (error.code === 'P2025') {
                // Record not found error
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            throw new HttpException(
                'An error occurred while deleting the user.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}