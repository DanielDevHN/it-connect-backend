import { Body, Controller, Get, Post, Put, Param, Patch, Delete } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { UpdateAssetDto, CreateAssetDto } from './assets.dto';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('assets')
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}

    @Get()
    getIncidents() {
        return this.assetsService.findAll();
    }

    @Get('/type')
    findAssetsByType() {
        return this.assetsService.findAssetsByType();
    }
    
    @Get('/owner')
    getUserWithMostAssets() {
        return this.assetsService.getUserWithMostAssets();
    }
    
    
    @Get('/recent')
    recentAssets() {
        return this.assetsService.recentAssets();
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: 'number', description: 'Incident ID' })
    getIncident(@Param('id') id: number) {
        return this.assetsService.findOne(id);
    }

    @Post()
    @ApiBody({ type: CreateAssetDto })
    createIncident(@Body() asset: CreateAssetDto) {
        return this.assetsService.createAsset(asset);
    }

    @Put()
    @ApiBody({ type: UpdateAssetDto })
    updateAsset(@Body() asset: UpdateAssetDto) {
        return this.assetsService.updateAsset(asset);
    }

    @Delete(':id')
    async deleteIncident(@Param('id') id: number) {
        return this.assetsService.deleteAsset(id);
    }
}