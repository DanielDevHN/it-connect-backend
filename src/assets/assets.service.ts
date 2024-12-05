import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAssetDto, UpdateAssetDto } from './assets.dto';
import { PrismaService } from 'src/prisma.service';
import { AssetStatus } from '@prisma/client';

@Injectable()
export class AssetsService {
    constructor(private prismaService: PrismaService) {}

    async findAssetsByType() {
        try {
            // Fetch all incidents with priority
            const assets = await this.prismaService.asset.findMany({
                select: {
                    type: true,
                },
            });
    
            // Count the total number of incidents for each priority
            const typeCounts = assets.reduce((acc, asset) => {
                const { type } = asset;
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
    
            // Transform the counts into the desired format
            const data = Object.entries(typeCounts).map(([type, total]) => ({
                name: type,
                total,
            }));
    
            return data;
        } catch (error) {
            console.log(error, 'error requests by types');

            throw new HttpException(
                'An error occurred while retrieving assets by type.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async recentAssets() {
        try {
            const assets = await this.prismaService.asset.findMany({
                where: {
                    status: { not: AssetStatus.INACTIVE || AssetStatus.DECOMMISSIONED },
                },
                orderBy: [
                    { updatedAt: 'desc' } // Then by updatedAt (descending)
                ],
                take: 5, // Limit the result to the top 5
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    type: true,
                    owner: true,
                    purchasedAt: true,
                    warrantyExpiresAt: true,
                    createdAt: true,
                    updatedAt: true,
                    incidents: true,
                    categories: true,
                },
            });
    
            return assets;
        } catch (error) {
            console.log(error, 'error recent assets');
            
            throw new HttpException(
                'An error occurred while retrieving the recent assets.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUserWithMostAssets() {
        try {
            const userWithMostAssets = await this.prismaService.asset.groupBy({
                by: ['ownerId'], // Group by requestor ID
                _count: {
                    id: true, // Count the number of requests per requestor
                },
                orderBy: {
                    _count: {
                        id: 'desc', // Sort by the count of requests in descending order
                    },
                },
                take: 1, // Limit the result to the top requestor
            });
    
            if (userWithMostAssets.length === 0) {
                throw new Error('No requestors found.');
            }
    
            // Get the detailed requestor info
            const topRequestor = await this.prismaService.user.findUnique({
                where: { id: userWithMostAssets[0].ownerId },
                select: {
                    id: true,
                    name: true,
                },
            });
    
            return {
                id: topRequestor.id,
                name: topRequestor.name,
                totalAssets: userWithMostAssets[0]._count.id,
            };
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving the requestor with the most requests.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async findAll() {
        try {
            const assets = await this.prismaService.asset.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    type: true,
                    owner: true,
                    purchasedAt: true,
                    warrantyExpiresAt: true,
                    createdAt: true,
                    updatedAt: true,
                    incidents: true,
                    articles: {
                        include: {
                            article: {
                                select: {
                                    id: true,
                                    title: true,
                                    docUrl: true,
                                    createdBy: true,
                                    lastModifiedBy: true,
                                }
                            }
                        },
                    },
                    categories: true,
                },
            });
            return assets;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving users.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number) {
        try {
            const asset = await this.prismaService.asset.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    type: true,
                    categories: true,
                    owner: true,
                    purchasedAt: true,
                    warrantyExpiresAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
    
            if (!asset) {
                throw new HttpException(
                    `Asset with ID ${id} not found.`,
                    HttpStatus.NOT_FOUND,
                );
            }
    
            return asset;
        } catch (error) {
            if (error.status == 404) {
                throw error
            }

            throw new HttpException(
                'An error occurred while retrieving the asset.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createAsset(createAssetDto: CreateAssetDto) {
        try {
            const {
                name,
                description,
                type,
                status,
                categories,
                ownerId,
                purchasedAt,
                warrantyExpiresAt,
                createdAt, 
            } = createAssetDto;
    
            // Create the asset record in the database
            const asset = await this.prismaService.asset.create({
                data: {
                    name,
                    description,
                    type: type || null,
                    status: status || null,
                    ownerId: ownerId || null,
                    purchasedAt,
                    warrantyExpiresAt: warrantyExpiresAt || null,
                    createdAt,
                    categories: {
                        connect: categories.map((categoryId) => ({ id: categoryId })),
                    },
                },
            });
    
            return asset;
        } catch (error) {
            console.error(error, 'Error creating asset');
            throw new HttpException(
                'An error occurred while creating the asset.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async updateAsset(updateAssetDto: UpdateAssetDto) {
        try {
            const {
                id,
                name,
                description,
                type,
                status,
                categories,
                ownerId,
                purchasedAt,
                warrantyExpiresAt,
            } = updateAssetDto;
    
            // Update the asset record in the database
            const updatedAsset = await this.prismaService.asset.update({
                where: { id }, // Use the asset ID to locate the asset
                data: {
                    name,
                    description,
                    type: type || null,
                    status: status || null,
                    ownerId: ownerId || null,
                    purchasedAt,
                    warrantyExpiresAt: warrantyExpiresAt || null,
                    categories: {
                        set: categories ? categories.map((categoryId) => ({ id: categoryId })) : [], // Replace categories
                    },
                },
            });
    
            return updatedAsset;
        } catch (error) {
            console.error(error, 'Error updating asset');
    
            if (error.code === 'P2025') {
                // Record not found error
                throw new HttpException(
                    'Asset not found.',
                    HttpStatus.NOT_FOUND,
                );
            }
    
            throw new HttpException(
                'An error occurred while updating the asset.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async deleteAsset(id: number) {
        try {
            // Delete the asset by its ID
            const deletedAsset = await this.prismaService.asset.delete({
                where: {
                    id,
                },
            });
    
            return deletedAsset;
        } catch (error) {
            console.error(error, 'Error deleting asset');
    
            if (error.code === 'P2025') {
                // Record not found error
                throw new HttpException(
                    'Asset not found.',
                    HttpStatus.NOT_FOUND,
                );
            }
    
            throw new HttpException(
                'An error occurred while deleting the asset.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    
}
