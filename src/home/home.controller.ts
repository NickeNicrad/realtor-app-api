import { Roles } from './../../decorators/roles.decorator';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';

import { HomeService } from './home.service';
import { User, UserParams } from 'decorators/user.decorator';
import { HomeResponseDto, CreateHomeDto, InquireDto, UpdateHomeDto } from './home.dto';
import { AuthGuard } from 'guards/auth.guard';
import { RolesGuard } from 'guards/roles.guard';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) {}

    @Roles(UserType.REALTOR, UserType.ADMIN)
    @UseGuards(RolesGuard)
    @Get()
    getHomes(
        @Query('city') city?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('property_type') property_type?: PropertyType,
    ): Promise<HomeResponseDto[]> {
        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte: parseFloat(minPrice)}),
            ...(maxPrice && {lte: parseFloat(maxPrice)}),
        } : undefined

        const queryParams = {
            ...(city && {city}),
            ...(price && {price}),
            ...(property_type && {property_type: property_type})
        }

        return this.homeService.getHomes(queryParams);
    }

    @Get(':id')
    getHome(@Param('id', ParseIntPipe) homeId) {
        return this.homeService.getHome(homeId);
    }

    @Roles(UserType.REALTOR, UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    createHome(@Body() body: CreateHomeDto, @User() user: UserParams) {
        return this.homeService.createHome(body, user.id);
    }

    @Put(':id')
    async updateHome(@Body() body: UpdateHomeDto, @Param('id', ParseIntPipe) homeId: number, @User() user: UserParams) {
        const realtor = await this.homeService.getRealtorByHome(homeId)
        if (realtor.id !== user.id) {
            throw new UnauthorizedException();
        }
        return await this.homeService.updateHome(body, homeId);
    }

    @Delete(':id')
    deleteHome(@Param('id', ParseIntPipe) homeId) {
        return this.homeService.deleteHome(homeId);
    }

    @UseGuards(AuthGuard)
    @Post('/:id/inquire')
    inquire(
        @Param('id', ParseIntPipe) homeId: number,
        @User() user: UserParams,
        @Body() body: InquireDto
    ) {
        return this.homeService.inquire(body, user, homeId)
    }

    @Roles(UserType.REALTOR)
    @UseGuards(AuthGuard, RolesGuard)
    @Get('/:id/messages')
    getHomeMessages(
        @Param('id', ParseIntPipe) homeId: number,
        @User() user: UserParams
    ) {
        return this.homeService.getHomeMessages(user, homeId);
    }
}
