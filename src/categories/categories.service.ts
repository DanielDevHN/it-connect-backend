import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BaseCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
    constructor(private prismaService: PrismaService) {}

    // Find all categories
    async findAll() {
        try {
            const categories = await this.prismaService.category.findMany({
                select: {
                    id: true,
                    name: true,
                },
            });
            return categories;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving categories.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Find a category by ID
    async findOne(id: number) {
        try {
            const category = await this.prismaService.category.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                },
            });
            if (!category) {
                throw new HttpException('Category not found.', HttpStatus.NOT_FOUND);
            }
            return category;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving the category.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Create a new category
    async create(data: { name: string }) {
        try {
            const newCategory = await this.prismaService.category.create({
                data: {
                    name: data.name,
                },
            });
            return newCategory;
        } catch (error) {
            throw new HttpException(
                'An error occurred while creating the category.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Update a category
    async update(_category:UpdateCategoryDto) {
        try {
            const category = await this.prismaService.category.update({
                where: { id: _category.id },
                data: {
                    name: _category.name,
                },
            });
            return category;
        } catch (error) {
            throw new HttpException(
                'An error occurred while updating the category.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Delete a category
    async delete(id: number) {
        try {
            await this.prismaService.category.delete({
                where: { id },
            });
            return { message: 'Category deleted successfully.' };
        } catch (error) {
            throw new HttpException(
                'An error occurred while deleting the category.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}