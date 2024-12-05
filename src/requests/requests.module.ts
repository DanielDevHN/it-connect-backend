import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    controllers: [RequestsController],
    providers: [RequestsService, PrismaService],
})
export class RequestsModule {}
