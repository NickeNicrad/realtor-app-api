import { HttpException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Image, PropertyType } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './home.dto';
import { UserParams } from 'decorators/user.decorator';

interface CreateHomeParams {
    city: string
    price: number
    address: string
    land_size: number
    realtor_id: number
    number_of_bedrooms: number
    number_of_bathrooms: number
    property_type: PropertyType
    images: {uri: string, home_id?: number}[]
}

interface UpdateHomeParams {
    city?: string
    price?: number
    address?: string
    land_size?: number
    realtor_id?: number
    number_of_bedrooms?: number
    number_of_bathrooms?: number
    property_type?: PropertyType
}

interface GetHomesParams {
    city?: string
    price?: {
        gte?: number
        lte?: number
    }
    property_type?: PropertyType
}

@Injectable()
export class HomeService {
    constructor(private readonly prismaService: PrismaService) {};

    async createHome(body: CreateHomeParams, realtor_id: number) {
        try {
            const home = await this.prismaService.home.create({
                data: {
                    realtor_id,
                    city: body.city,
                    price: body.price,
                    address: body.address,
                    land_size: body.land_size,
                    property_type: body.property_type,
                    number_of_bedrooms: body.number_of_bedrooms,
                    number_of_bathrooms: body.number_of_bathrooms,
                }
            });

            const images = await this.prismaService.image.createMany({data: body.images && body.images?.map(image => ({...image, home_id: home.id}))})
    
            return home;
        } catch (error) {
            return new InternalServerErrorException(`Something went wrong! ${error?.message}`);
        }
    }

    async getHomes(filters: GetHomesParams): Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany({
            select: {
                id: true,
                address: true,
                city: true,
                price: true,
                property_type: true,
                number_of_bathrooms: true,
                number_of_bedrooms: true,
                images: {
                    select: {
                        uri: true
                    },
                    take: 1,
                }
            },
            where: filters
        });

        if (!homes.length)
            throw new NotFoundException('No items available!');

        return homes.map(home => {
            const image = home.images.length > 0 ? home.images[0].uri : ''
            delete home.images
            return new HomeResponseDto({...home, image})
        });
    }

    async getHome(id: number) {
        try {
            const home = await this.prismaService.home.findUnique({
                where: {id},
            });

            if (!home)
                return new NotFoundException('Not found!');

            return home;
        } catch (error) {
            return new InternalServerErrorException(`Something went wrong! ${error?.message}`);
        }
    }

    async updateHome(body: UpdateHomeParams, id: number): Promise<HomeResponseDto> {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            }
        });
        
        if (!home)
            throw new NotFoundException('Not found!');

        return new HomeResponseDto(await this.prismaService.home.update({
            where: {
                id
            },
            data: {
                ...body
            }
        }))
    }

    async deleteHome(id: number) {
        try {
            const home = await this.prismaService.home.findUnique({
                where: {
                    id
                }
            });
            
            if (!home)
                return new NotFoundException('Not found!');

            await this.prismaService.home.delete({
                where: {
                    id
                }
            })

            return new HttpException('Successfully deleted!', 200);
        } catch (error) {
            return new InternalServerErrorException(`Something went wrong! ${error?.message}`);
        }
    }

    async getRealtorByHome(id: number) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            },
            select: {
                realtor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!home) {
            throw new NotFoundException('Not found!');
        }

        return home.realtor;
    }

    async inquire(body: {message: string}, buyer: UserParams, homeId: number) {
        const realtor = await this.getRealtorByHome(homeId);

        if (!realtor || !buyer.id || !body.message)
            throw new NotAcceptableException('Provide all required information');

        const newMessage = await this.prismaService.message.create({
            data: {
                home_id: homeId,
                buyer_id: buyer.id,
                message: body.message,
                realtor_id: realtor.id,
            }
        })

        return newMessage
    }

    async getHomeMessages(user: UserParams, homeId: number) {
        const realtor = await this.getRealtorByHome(homeId);

        if (realtor.id !== user.id)
            throw new UnauthorizedException("You're not allowed to perform this action");

        return this.prismaService.message.findMany({
            where: {
                home_id: homeId
            },
            select: {
                id: true,
                message: true,
                created_at: true,
                buyer: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    }
}
