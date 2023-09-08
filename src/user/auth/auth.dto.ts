import { UserType } from '@prisma/client';
import {IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional} from 'class-validator'

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    name: string
    @Matches(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, {
        message: 'Phone number must be valid. example (07XXX)'
    })
    phone: string
    @IsEmail()
    email: string
    @IsString()
    @MinLength(8)
    password: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    productKey?: string
}

export class SignInDto {
    @IsEmail()
    email: string
    @IsString()
    @MinLength(8)
    password: string
}

export class GenerateProductKeyDto {
    @IsEmail()
    email: string;
    @IsEnum(UserType)
    user_type: UserType;
}