import { Module } from '@nestjs/common';
import { KnowledgeArticlesController } from './knowledgearticles.controller';
import { KnowledgearticlesService } from './knowledgearticles.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [KnowledgeArticlesController],
  providers: [KnowledgearticlesService, PrismaService],
})
export class KnowledgearticlesModule {}
