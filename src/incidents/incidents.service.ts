import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateIncidentDto, UpdateIncidentDto } from './incidents.dto';
import { PrismaService } from 'src/prisma.service';
import { IncidentStatus } from '@prisma/client';

@Injectable()
export class IncidentsService {
    constructor(private prismaService: PrismaService) {}

    async findIncidentsByPriority() {
        try {
            // Fetch all incidents with priority
            const incidents = await this.prismaService.incident.findMany({
                select: {
                    priority: true,
                },
            });
    
            // Count the total number of incidents for each priority
            const priorityCounts = incidents.reduce((acc, incident) => {
                const { priority } = incident;
                acc[priority] = (acc[priority] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
    
            // Transform the counts into the desired format
            const data = Object.entries(priorityCounts).map(([priority, total]) => ({
                name: priority,
                total,
            }));
    
            return data;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving incidents by priority.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async recentIncidents() {
        try {
            const incidents = await this.prismaService.incident.findMany({
                where: {
                    status: {not: IncidentStatus.RESOLVED || IncidentStatus.CLOSED},
                },
                orderBy: [
                    { priority: 'desc' }, // Order by priority (descending)
                    { updatedAt: 'desc' } // Then by updatedAt (descending)
                ],
                take: 5, // Limit the result to the top 5
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    categories: true,
                    reporter: true,
                    assignee: true,
                    asset: true,
                    createdAt: true,
                    updatedAt: true,
                    resolvedAt: true,
                },
            });
    
            return incidents;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving the top 5 incidents.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAssetWithMostIncidents() {
        try {
          const assetWithMostIncidents = await this.prismaService.asset.findFirst({
            include: {
              incidents: true, // Include incidents for detailed information if needed
            },
            orderBy: {
              incidents: {
                _count: 'desc', // Sort by the count of incidents in descending order
              },
            },
            take: 1, // Get only the top asset
          });
      
          return assetWithMostIncidents;
        } catch (error) {
          throw new HttpException(
            'An error occurred while retrieving the asset with the most incidents.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
    }      
    
    async getAssigneeWithMostResolvedIncidents() {
        try {
          const assigneesWithMostResolved = await this.prismaService.user.findMany({
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  assignedIncidents: true,
                },
              },
            },
            where: {
                assignedIncidents: {
                    some: {
                        status: IncidentStatus.RESOLVED, // Filter for resolved incidents
                    },
                },
            },
            orderBy: {
              assignedIncidents: {
                _count: 'desc', // Sort by the count of resolved incidents
              },
            },
            // take: 1, // Limit to the top assignee
          });

          //   console.log(assigneesWithMostResolved, 'assigneeWithMostResolved');
            if (assigneesWithMostResolved.length === 0) {
                throw new Error('No assignees with resolved incidents found.');
            }
      
            return {
                id: assigneesWithMostResolved[0].id,
                name: assigneesWithMostResolved[0].name,
                resolvedIncidents: assigneesWithMostResolved[0]._count.assignedIncidents,
            };
        } catch (error) {
          throw new HttpException(
            'An error occurred while retrieving the assignee with the most resolved incidents.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
    }
      

    async findAll() {
        try {
            const incidents = await this.prismaService.incident.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    categories: true,
                    reporter: true,
                    assignee: true,
                    asset: true,
                    createdAt: true,
                    updatedAt: true,
                    resolvedAt: true,
                },
            });
            return incidents;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving incidents.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number) {
        try {
            const incident = await this.prismaService.incident.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    priority: true,
                    categories: true,
                    reporter: true,
                    assignee: true,
                    asset: true,
                    createdAt: true,
                    updatedAt: true,
                    resolvedAt: true,
                    comments: {
                        include: {
                            user: true,
                        }
                    },
                },
            });
    
            if (!incident) {
                throw new HttpException(
                    `Incident with ID ${id} not found.`,
                    HttpStatus.NOT_FOUND,
                );
            }
    
            return incident;
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

    async createIncident(incidentDto: CreateIncidentDto) {
        try {
            const { title, description, priority, categories, reporterId, assetId, assigneeId } = incidentDto;
    
            // Create the incident record in the database
            const incident = await this.prismaService.incident.create({
              data: {
                title,
                description,
                priority, 
                reporterId,
                assetId: assetId || null,
                assigneeId: assigneeId || null,
                categories: {
                  connect: categories.map((categoryId) => ({ id: categoryId })),
                },
              },
            });
        
            return incident;
        } catch (error) {
            console.log(error, 'Error creating incident');            
            throw new HttpException(
                'An error occurred while creating the category.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateIncident(incidentDto: UpdateIncidentDto) {
        try {
            const { title, description, status, priority, categories, reporterId, assetId, assigneeId, resolvedAt } = incidentDto;
    
            // Update the incident record in the database
            const updatedIncident = await this.prismaService.incident.update({
                where: { id: incidentDto.id }, // Use the incidentId to find the incident
                data: {
                    title,
                    description,
                    priority,
                    reporterId,
                    status: status,
                    assetId: assetId || null,
                    assigneeId: assigneeId || null,
                    resolvedAt: resolvedAt || null,
                    categories: {
                        set: categories ? categories.map((categoryId) => ({ id: categoryId })) : [], // Update categories
                    },
                },
            });
    
            return updatedIncident;
        } catch (error) {
            console.log(error, 'Error updating incident');
            throw new HttpException(
                'An error occurred while updating the incident.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    
    async deleteIncident(id: number) {
        try {
            await this.prismaService.incidentComment.deleteMany({
                where: {
                    incidentId: id,
                },
            });
            // Delete user by ID
            const deletedIncident = await this.prismaService.incident.delete({
                where: {
                    id,
                },
            });

            return deletedIncident;
        } catch (error) {
            if (error.code === 'P2025') {
                // Record not found error
                throw new HttpException(
                    'Incident not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            throw new HttpException(
                'An error occurred while deleting the incident.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
