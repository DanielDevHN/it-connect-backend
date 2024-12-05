import { Body, Controller, Get, Post, Put, Patch, Param, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto, UpdateRequestDto, AssignRequestDto } from './requests.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @Get()
    getAllServiceRequests() {
        return this.requestsService.findAll();
    }
    
    @Get('/status')
    findRequestsByStatus() {
        return this.requestsService.findRequestsByStatus();
    }
    
    @Get('/requestor')
    getRequestorWithMostRequests() {
        return this.requestsService.getRequestorWithMostRequests();
    }
    
    @Get('/assignee')
    getAssigneeWithMostResolvedRequests() {
        return this.requestsService.getAssigneeWithMostResolvedRequests();
    }
    
    @Get('/recent')
    getRecentRequests() {
        return this.requestsService.recentRequests();
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'number', description: 'Service Request ID' })
    getServiceRequest(@Param('id') id: number) {
        return this.requestsService.findOne(id);
    }

    @Post()
    @ApiBody({ type: CreateRequestDto })
    createServiceRequest(@Body() serviceRequest: CreateRequestDto) {
        return this.requestsService.createRequest(serviceRequest);
    }

    @Put()
    @ApiBody({ type: UpdateRequestDto })
    updateServiceRequest(@Body() request: UpdateRequestDto) {
        return this.requestsService.updateRequest(request);
    }

    @Delete(':id')
    async deleteIncident(@Param('id') id: number) {
        return this.requestsService.deleteRequest(id);
    }
}
