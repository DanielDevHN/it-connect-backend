import { Body, Controller, Get, Post, Put, Param, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, CreateIncidentDto, UpdateIncidentDto } from './comments.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post('/incidents')
    @ApiBody({ type: CreateCommentDto })
    createIncidentComment(@Body() comment: CreateCommentDto) {
        return this.commentsService.createIncidentComment(comment);
    }

    @Post('/requests')
    @ApiBody({ type: CreateCommentDto })
    createRequestComment(@Body() comment: CreateCommentDto) {
        console.log('ey!');        
        return this.commentsService.createRequestComment(comment);
    }
}