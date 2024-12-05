import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateKnowledgearticleDto, UpdateKnowledgearticleDto } from './knowledgearticles.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class KnowledgearticlesService {
    constructor(private prismaService: PrismaService) {}

    async findArticlesByCategory() {
        try {
            // Fetch all articles with their categories
            const articles = await this.prismaService.knowledgeArticle.findMany({
                select: {
                    categories: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
    
            // Count the number of articles for each category
            const categoryCounts = articles.reduce((acc, article) => {
                // Each article can belong to multiple categories
                article.categories.forEach(({ name }) => {
                    acc[name] = (acc[name] || 0) + 1;
                });
                return acc;
            }, {} as Record<string, number>);
    
            // Transform the counts into the desired format
            const data = Object.entries(categoryCounts).map(([category, total]) => ({
                name: category,
                total,
            }));
    
            return data;
        } catch (error) {
            console.error(error, 'error retrieving articles by category');
    
            throw new HttpException(
                'An error occurred while retrieving articles by category.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async recentArticles() {
        try {
            const assets = await this.prismaService.knowledgeArticle.findMany({
                orderBy: [
                    { updatedAt: 'desc' } // Then by updatedAt (descending)
                ],
                take: 5, // Limit the result to the top 5
                select: {
                    id: true,
                    title: true,
                    docUrl: true,
                    categories: true,
                    assets: true,
                    createdAt: true,
                    updatedAt: true,
                    createdBy: true,
                    lastModifiedBy: true,
                },
            });
    
            return assets;
        } catch (error) {
            console.log(error, 'error recent articles');
            
            throw new HttpException(
                'An error occurred while retrieving the recent articles.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAssetWithMostArticles() {
        try {
            // Group by asset ID and count the related articles
            const assetWithMostArticles = await this.prismaService.assetArticle.groupBy({
                by: ['assetId'], // Group by asset ID
                _count: {
                    assetId: true, // Count the number of related articles
                },
                orderBy: {
                    _count: {
                        assetId: 'desc', // Sort by the count in descending order
                    },
                },
                take: 1, // Take the asset with the highest count
            });
    
            // If no articles are found
            if (assetWithMostArticles.length === 0) {
                throw new Error('No assets found with related articles.');
            }
    
            // Fetch detailed information about the asset
            const topAsset = await this.prismaService.asset.findUnique({
                where: { id: assetWithMostArticles[0].assetId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    type: true,
                    status: true,
                    articles: true, // Optionally include articles
                },
            });
    
            return {
                id: topAsset.id,
                name: topAsset.name,
                description: topAsset.description,
                type: topAsset.type,
                status: topAsset.status,
                totalArticles: assetWithMostArticles[0]._count.assetId, // Total articles
            };
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving the asset with the most related articles.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async getPersonWithMostArticles() {
        try {
            // Group by the user ID who created the articles
            const personWithMostArticles = await this.prismaService.knowledgeArticle.groupBy({
                by: ['createdById'], // Group by creator ID
                _count: {
                    id: true, // Count the number of articles
                },
                orderBy: {
                    _count: {
                        id: 'desc', // Sort by the count of articles in descending order
                    },
                },
                take: 1, // Take the person with the highest count
            });
    
            // If no articles are found
            if (personWithMostArticles.length === 0) {
                throw new Error('No authors found.');
            }
    
            // Fetch detailed information about the top author
            const topAuthor = await this.prismaService.user.findUnique({
                where: { id: personWithMostArticles[0].createdById },
                select: {
                    id: true,
                    name: true,
                    email: true, // Include other fields if needed
                },
            });
    
            return {
                id: topAuthor.id,
                name: topAuthor.name,
                email: topAuthor.email,
                totalArticles: personWithMostArticles[0]._count.id, // Total articles created
            };
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving the person who created the most articles.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async findAll() {
        try {
            const knowledgeArticles = await this.prismaService.knowledgeArticle.findMany({
                select: {
                    id: true,
                    title: true,
                    docUrl: true,
                    categories: true,
                    assets: {
                        include: {
                            asset: true, // Include the actual asset data
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    createdBy: true,
                    lastModifiedBy: true,
                },
            });
            return knowledgeArticles;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving incidents.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number) {
        try {
            const knowledgeArticles = await this.prismaService.knowledgeArticle.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    docUrl: true,
                    categories: true,
                    assets: {
                        include: {
                            asset: true, // Include the actual asset data
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                    createdBy: true,
                    lastModifiedBy: true,
                },
            });
    
            if (!knowledgeArticles) {
                throw new HttpException(
                    'Incident with ID ${id} not found.',
                    HttpStatus.NOT_FOUND,
                );
            }
    
            return knowledgeArticles;
        } catch (error) {
            if (error.status == 404) {
                throw error
            }

            throw new HttpException(
                'An error occurred while retrieving the user.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createKnowledgeArticle(incidentDto: CreateKnowledgearticleDto) {
        try {
            const { title, docUrl, createdAt, createdById, assets, categories} = incidentDto;
                          
            // Create the incident record in the database
            const knowledgeArticles = await this.prismaService.knowledgeArticle.create({
              data: {
                title,
                docUrl,
                createdAt: createdAt || null,
                createdById: createdById || null,
                assets: {
                    create: assets.map((assetId) => ({
                        assetId: assetId,
                    })),
                  },
                categories: {
                    connect: categories.map((categoryId) => ({ id: categoryId })),
                  },
              },
            });
        
            return knowledgeArticles;
        } catch (error) {
            console.log(error, 'Error creating article');            
            throw new HttpException(
                'An error occurred while creating the article.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateKnowledgeArticle(articleDto: UpdateKnowledgearticleDto) {
        try {
            const { title, createdAt, docUrl, createdById, assets, categories } = articleDto;

            // Fetch existing asset connections for the article
            const existingAssetArticles = await this.prismaService.assetArticle.findMany({
                where: {
                    articleId: articleDto.id,
                },
                select: {
                    assetId: true,
                },
            });

            // Extract existing asset IDs connected to the article
            const existingAssetIds = existingAssetArticles.map((assetArticle) => assetArticle.assetId);

            // Determine which assets to connect (assets not yet connected)
            const assetsToConnect = assets.filter((assetId) => !existingAssetIds.includes(assetId));

            // Determine which assets to disconnect (assets no longer in the assets array)
            const assetsToDisconnect = existingAssetIds.filter((assetId) => !assets.includes(assetId));

            // Update the article with assets and categories
            const knowledgeArticles = await this.prismaService.knowledgeArticle.update({
                where: { id: articleDto.id }, // Find the article by ID
                data: {
                    title,
                    docUrl,
                    createdAt: createdAt || null,
                    createdById: createdById || null,
                    // Connect new assets
                    assets: {
                        create: assetsToConnect.map((assetId) => ({
                            asset: { connect: { id: assetId } },
                        })),
                        deleteMany: assetsToDisconnect.map((assetId) => ({
                            assetId,
                            articleId: articleDto.id,
                        })),
                    },
                    // Connect categories
                    categories: {
                        connect: categories.map((categoryId) => ({ id: categoryId })),
                    },
                },
            });

            return knowledgeArticles;
        } catch (error) {
            console.log(error, 'Error updating knowledge article');
            throw new HttpException(
                'An error occurred while updating the article.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    
    async deleteKnowledgeArticle(id: number) {
        try {
            // Start a transaction to ensure all operations are consistent
            await this.prismaService.$transaction(async (prisma) => {
                // Delete all related AssetArticles
                await prisma.assetArticle.deleteMany({
                    where: {
                        articleId: id,
                    },
                });
    
                // Delete the KnowledgeArticle
                const knowledgeArticle = await prisma.knowledgeArticle.delete({
                    where: {
                        id,
                    },
                });
    
                return knowledgeArticle;
            });
        } catch (error) {
            if (error.code === 'P2025') {
                // Record not found error
                throw new HttpException(
                    'Knowledge article not found.',
                    HttpStatus.NOT_FOUND,
                );
            }
    
            throw new HttpException(
                'An error occurred while deleting the knowledge article.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    
}