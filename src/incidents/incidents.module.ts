import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [IncidentsController],
  providers: [IncidentsService, PrismaService],
})
export class IncidentsModule {}
