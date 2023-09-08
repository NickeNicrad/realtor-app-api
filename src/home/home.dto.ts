import { PropertyType } from "@prisma/client";
import { Exclude, Expose, Type } from 'class-transformer'
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";

export class Image {
    @IsNotEmpty()
    @IsString()
    uri: string
}

export class HomeResponseDto {
    id: number
    address: string
    city: string
    price: number
    image: string
    @Exclude()
    land_size: number
    @Expose({name: 'landSize'})
    landSize() {
        return this.land_size
    }
    @Exclude()
    realtor_id: number
    @Exclude()
    listed_date: Date
    @Expose({name: 'listedDate'})
    listedData() {
        return this.listed_date
    }
    @Exclude()
    number_of_bedrooms: number
    @Expose({name: 'numberOfBedrooms'})
    numberOfBedrooms() {
        return this.number_of_bedrooms
    }
    @Exclude()
    number_of_bathrooms: number
    @Expose({name: 'numberOfBathrooms'})
    numberOfBathrooms() {
        return this.number_of_bathrooms
    }
    @Exclude()
    property_type: PropertyType
    @Expose({name: 'propertyType'})
    propertyType() {
        return this.property_type
    }

    constructor (partial: Partial<HomeResponseDto>) {
        Object.assign(this, partial)
    }
}

export class CreateHomeDto {
    @IsNotEmpty()
    @IsString()
    address: string
    @IsNotEmpty()
    @IsString()
    city: string
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    land_size: number
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    realtor_id: number
    @IsOptional()
    @IsNumber()
    @IsPositive()
    number_of_bedrooms: number
    @IsOptional()
    @IsNumber()
    @IsPositive()
    number_of_bathrooms: number
    @IsNotEmpty()
    @IsEnum(PropertyType)
    property_type: PropertyType
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true})
    @Type(() => Image)
    images: Image[]
}

export class UpdateHomeDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    address?: string
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city?: string
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price?: number
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    land_size?: number
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    realtor_id?: number
    @IsOptional()
    @IsNumber()
    @IsPositive()
    number_of_bedrooms?: number
    @IsOptional()
    @IsNumber()
    @IsPositive()
    number_of_bathrooms?: number
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(PropertyType)
    property_type?: PropertyType
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true})
    @Type(() => Image)
    images: Image[]
}

export class InquireDto {
    @IsNotEmpty()
    @IsString()
    message: string
}