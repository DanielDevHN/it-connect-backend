import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto, CreateIncidentDto, UpdateIncidentDto } from './comments.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private prismaService: PrismaService) {}

    async createIncidentComment(payload: CreateCommentDto) {
        try {
            const { content, userId, id, createdAt } = payload;

            // Assuming 'sender' is the userId; you should get this based on your application logic

            const comment = await this.prismaService.incidentComment.create({
                data: {
                    content: content,
                    incidentId: id,
                    userId: userId,
                    createdAt: createdAt
                },
            });

            console.log('Comment created:', comment);            

            return comment;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw new HttpException('Error creating comment.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createRequestComment(payload: CreateCommentDto) {
        try {
            console.log('ey!');        

            const { content, userId, id, createdAt } = payload;

            // Assuming 'sender' is the userId; you should get this based on your application logic

            const comment = await this.prismaService.requestComment.create({
                data: {
                    content: content,
                    requestId: id,
                    userId: userId,
                    createdAt: createdAt
                },
            });

            return comment;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw new HttpException('Error creating comment.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
