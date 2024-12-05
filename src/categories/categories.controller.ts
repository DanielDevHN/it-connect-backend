import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { BaseCategoryDto, UpdateCategoryDto } from './categories.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // Get all categories
    @Get()
    async findAll() {
        return this.categoriesService.findAll();
    }

    // Get a category by ID
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    // Create a new category
    @Post()
    @ApiBody({type: BaseCategoryDto})
    async create(@Body() createCategoryDto: BaseCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    // Update a category by ID
    @Put()
    @ApiBody({type: UpdateCategoryDto})
    async update(@Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(updateCategoryDto);
    }

    // Delete a category by ID
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.categoriesService.delete(id);
    }
}