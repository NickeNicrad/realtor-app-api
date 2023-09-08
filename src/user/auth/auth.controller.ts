import { Controller, Post, Body, Get, Param, ParseEnumPipe, UnauthorizedException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, GenerateProductKeyDto } from './auth.dto';
import { User, UserParams } from '../../../decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/signup/:userType')
    async signup(@Param('userType', new ParseEnumPipe(UserType)) user_type: UserType, @Body() body: SignUpDto) {
        if (user_type !== UserType.BUYER) {
            if (!body.productKey){
                return new UnauthorizedException('Invalid product key');
            }

            const validProductKey = `${body.email}-${user_type}-${process.env.PRODUCT_SECRET_KEY}`;

            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

            if (!isValidProductKey){
                return new UnauthorizedException('Invalid product key');
            }
        }
        
        return this.authService.signup(body, user_type);
    }

    @Post('/signin')
    signin(@Body() body: SignInDto) {
        return this.authService.signin(body);
    }

    @Post('/key')
    async generateProductKey(@Body() body: GenerateProductKeyDto) {
        const key = await this.authService.generateProductKey(body);
        return {
            key
        }
    }

    @Get('/me')
    me(@User() user: UserParams) {
        return user
    }
}
