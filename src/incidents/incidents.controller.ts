import { Body, Controller, Get, Post, Put, Param, Patch, Delete } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateCommentDto, CreateIncidentDto, UpdateIncidentDto } from './incidents.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('incidents')
export class IncidentsController {
    constructor(private readonly incidentsService: IncidentsService) {}

    @Get()
    getIncidents() {
        return this.incidentsService.findAll();
    }

    @Get('/priority')
    getIncidentsByPriority() {
        return this.incidentsService.findIncidentsByPriority();
    }

    @Get('/asset')
    getAssetWithMostIncidents() {
        return this.incidentsService.getAssetWithMostIncidents();
    }

    @Get('/assignee')
    getAssigneeWithMostResolvedIncidents() {
        return this.incidentsService.getAssigneeWithMostResolvedIncidents();
    }

    @Get('/recent')
    getRecentIncidents() {
        return this.incidentsService.recentIncidents();
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'number', description: 'Incident ID' })
    getIncident(@Param('id') id: number) {
        return this.incidentsService.findOne(id);
    }

    @Post()
    @ApiBody({ type: CreateIncidentDto })
    createIncident(@Body() incident: CreateIncidentDto) {
        return this.incidentsService.createIncident(incident);
    }

    @Put()
    @ApiBody({ type: UpdateIncidentDto })
    updateIncident(@Body() incident: UpdateIncidentDto) {
        return this.incidentsService.updateIncident(incident);
    }

    @Delete(':id')
    async deleteIncident(@Param('id') id: number) {
        return this.incidentsService.deleteIncident(id);
    }
}