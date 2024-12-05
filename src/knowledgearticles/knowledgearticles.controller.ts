import { Body, Controller, Get, Post, Put, Param, Patch, Delete } from '@nestjs/common';
import { KnowledgearticlesService } from './knowledgearticles.service';
import { CreateKnowledgearticleDto, UpdateKnowledgearticleDto } from './knowledgearticles.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('knowledgearticles')
export class KnowledgeArticlesController {
    constructor(private readonly knowledgearticlesService: KnowledgearticlesService) {}

    @Get()
    getIncidents() {
        return this.knowledgearticlesService.findAll();
    }

    @Get('/category')
    findArticlesByCategory() {
        return this.knowledgearticlesService.findArticlesByCategory();
    }

    @Get('/creator')
    getPersonWithMostArticles() {
        return this.knowledgearticlesService.getPersonWithMostArticles();
    }
    
    @Get('/asset')
    getAssetWithMostArticles() {
        return this.knowledgearticlesService.getAssetWithMostArticles();
    }
    
    @Get('/recent')
    recentArticles() {
        return this.knowledgearticlesService.recentArticles();
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'number', description: 'Incident ID' })
    getIncident(@Param('id') id: number) {
        return this.knowledgearticlesService.findOne(id);
    }

    @Post()
    @ApiBody({ type: CreateKnowledgearticleDto })
    createIncident(@Body() knowledgeArticleId: CreateKnowledgearticleDto) {
        return this.knowledgearticlesService.createKnowledgeArticle(knowledgeArticleId);
    }

    @Put()
    @ApiBody({ type: UpdateKnowledgearticleDto })
    updateIncident(@Body() knowledgeArticleId: UpdateKnowledgearticleDto) {
        return this.knowledgearticlesService.updateKnowledgeArticle(knowledgeArticleId);
    }

    @Delete(':id')
    async deleteUser(@Param('id') knowledgeArticleId: number) {
        return this.knowledgearticlesService.deleteKnowledgeArticle(knowledgeArticleId);
    }
}