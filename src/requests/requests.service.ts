import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRequestDto, UpdateRequestDto } from './requests.dto';
import { PrismaService } from 'src/prisma.service';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class RequestsService {
    constructor(private prismaService: PrismaService) {}

    async findRequestsByStatus() {
        try {
            // Fetch all incidents with priority
            const requests = await this.prismaService.request.findMany({
                select: {
                    status: true,
                },
            });
    
            // Count the total number of incidents for each priority
            const statusCounts = requests.reduce((acc, request) => {
                const { status } = request;
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
    
            // Transform the counts into the desired format
            const data = Object.entries(statusCounts).map(([status, total]) => ({
                name: status,
                total,
            }));
    
            return data;
        } catch (error) {
            console.log(error, 'error requests by status');

            throw new HttpException(
                'An error occurred while retrieving requests by status.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async recentRequests() {
        try {
            const requests = await this.prismaService.request.findMany({
                where: {
                    status: {not: RequestStatus.COMPLETED || RequestStatus.CANCELED},
                },
                orderBy: [
                    { updatedAt: 'desc' } // Then by updatedAt (descending)
                ],
                take: 5, // Limit the result to the top 5
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    categories: true,
                    requestor: true,
                    assignee: true,
                    createdAt: true,
                    updatedAt: true,
                    plannedForDate: true,
                    resolvedAt: true,
                    approvers: true,
                },
            });
    
            return requests;
        } catch (error) {

            console.log(error, 'error recent requests');
            

            throw new HttpException(
                'An error occurred while retrieving the recent requests.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getRequestorWithMostRequests() {
        try {
            const requestorWithMostRequests = await this.prismaService.request.groupBy({
                by: ['requestorId'], // Group by requestor ID
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
    
            if (requestorWithMostRequests.length === 0) {
                throw new Error('No requestors found.');
            }
    
            // Get the detailed requestor info
            const topRequestor = await this.prismaService.user.findUnique({
                where: { id: requestorWithMostRequests[0].requestorId },
                select: {
                    id: true,
                    name: true,
                },
            });
    
            return {
                id: topRequestor.id,
                name: topRequestor.name,
                totalRequests: requestorWithMostRequests[0]._count.id,
            };
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving the requestor with the most requests.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async getAssigneeWithMostResolvedRequests() {
        try {
          const assigneesWithMostResolved = await this.prismaService.user.findMany({
            select: {
              id: true,
              name: true,
              _count: {
                select: {
                  asignedRequests: true,
                },
              },
            },
            where: {
                asignedRequests: {
                    some: {
                        status: RequestStatus.COMPLETED, // Filter for resolved incidents
                    },
                },
            },
            orderBy: {
              asignedRequests: {
                _count: 'desc', // Sort by the count of resolved incidents
              },
            },
            // take: 1, // Limit to the top assignee
          });

            // console.log(assigneesWithMostResolved, 'assigneeWithMostResolved');
            if (assigneesWithMostResolved.length === 0) {
                throw new Error('No assignees with resolved requests found.');
            }
      
            return {
                id: assigneesWithMostResolved[0].id,
                name: assigneesWithMostResolved[0].name,
                resolvedRequests: assigneesWithMostResolved[0]._count.asignedRequests,
            };
        } catch (error) {
          throw new HttpException(
            'An error occurred while retrieving the assignee with the most resolved requests.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
    }

    async findAll() {
        try {
            const requests = await this.prismaService.request.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    categories: true,
                    requestor: true,
                    assignee: true,
                    createdAt: true,
                    updatedAt: true,
                    plannedForDate: true,
                    resolvedAt: true,
                    approvers: true,
                },
            });
            return requests;
        } catch (error) {
            throw new HttpException(
                'An error occurred while retrieving users.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: number) {
        try {
            const request = await this.prismaService.request.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    categories: true,
                    requestor: true,
                    assignee: true,
                    plannedForDate: true,
                    resolvedAt: true,
                    createdAt: true,
                    updatedAt: true,
                    comments: {
                        include: {
                            user: true,
                        },
                    }
                },
            });
    
            if (!request) {
                throw new HttpException(
                    `Request with ID ${id} not found.`,
                    HttpStatus.NOT_FOUND,
                );
            }
    
            return request;
        } catch (error) {
            if (error.status == 404) {
                throw error
            }

            throw new HttpException(
                'An error occurred while retrieving the request.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createRequest(requestDto: CreateRequestDto) {
        try {
            const {
                title,
                description,
                categories,
                requestorId,
                assigneeId,
                plannedForDate,
            } = requestDto;
    
            // Create the request record in the database
            const request = await this.prismaService.request.create({
                data: {
                    title,
                    description,
                    requestorId,
                    plannedForDate,
                    assigneeId: assigneeId || null,
                    categories: {
                        connect: categories.map((categoryId) => ({ id: categoryId })),
                    },
                },
            });
    
            return request;
        } catch (error) {
            console.error(error, 'Error creating request');

            if (error.code === 'P2003') {
                // Foreign key constraint violation
                throw new HttpException(
                    'Invalid foreign key value. Please ensure all related entities exist.',
                    HttpStatus.BAD_REQUEST,
                );
            }
    
            if (error.code === 'P2002') {
                // Unique constraint violation
                throw new HttpException(
                    'Duplicate field value detected. Ensure unique fields are not repeated.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            throw new HttpException(
                'An error occurred while creating the request.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }    

    async updateRequest(requestDto: UpdateRequestDto) {
        try {
            const {
                id,
                title,
                description,
                status,
                categories,
                requestorId,
                assigneeId,
                plannedForDate,
                resolvedAt
            } = requestDto;
    
            // Update the request record in the database
            const request = await this.prismaService.request.update({
                where: {
                    id,
                },
                data: {
                    title,
                    description,
                    status,
                    requestorId,
                    plannedForDate,
                    assigneeId: assigneeId || null,
                    resolvedAt: resolvedAt || null,
                    categories: {
                        set: categories.map((categoryId) => ({ id: categoryId })), // 'set' replaces the existing categories
                    },
                },
            });
    
            return request;
        } catch (error) {
            console.error(error, 'Error updating request');
    
            if (error.code === 'P2003') {
                // Foreign key constraint violation
                throw new HttpException(
                    'Invalid foreign key value. Please ensure all related entities exist.',
                    HttpStatus.BAD_REQUEST,
                );
            }
    
            if (error.code === 'P2002') {
                // Unique constraint violation
                throw new HttpException(
                    'Duplicate field value detected. Ensure unique fields are not repeated.',
                    HttpStatus.BAD_REQUEST,
                );
            }
    
            throw new HttpException(
                'An error occurred while updating the request.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async deleteRequest(id: number) {
        try {
            await this.prismaService.requestComment.deleteMany({
                where: {
                    requestId: id,
                },
            });
            // Delete user by ID
            const deletedIRequest = await this.prismaService.request.delete({
                where: {
                    id,
                },
            });

            return deletedIRequest;
        } catch (error) {
            if (error.code === 'P2025') {
                // Record not found error
                throw new HttpException(
                    'Request not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            throw new HttpException(
                'An error occurred while deleting the Request.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}