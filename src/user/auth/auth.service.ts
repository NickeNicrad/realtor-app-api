import { 
    Injectable,
    ConflictException, 
    NotFoundException, 
    ForbiddenException, 
    InternalServerErrorException, 
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import optionsJWT from 'functions/optionsJWT';

interface SignUpParams {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface SignInParams {
    email: string;
    password: string;
}

interface generateProductKeyParams {
    email: string;
    user_type: UserType;
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {};

    async signin({email, password}: SignInParams) {
        try {
            const userExists = await this.prismaService.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    user_type: true,
                }
            });

            if (!userExists)
                return new NotFoundException('Account not found!');

            const isPasswordValid = await bcrypt.compare(password, userExists.password);

            if (!isPasswordValid)
                return new ForbiddenException('Invalid credentials!');

            const token = await optionsJWT.generateJWT(userExists);

            return {
                token
            };
        } catch (error) {
            return new InternalServerErrorException(`Something went wrong! ${error?.message}`);
        }
    }


    async signup({name, email, phone, password}: SignUpParams, user_type: UserType) {
        try {
            const userExists = await this.prismaService.user.findUnique({where: {email}});

            if (userExists) {
                return new ConflictException('Account already exist');
            };

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await this.prismaService.user.create({
                data: {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    user_type,
                },
                select: {
                    id: true,
                    user_type: true
                }
            });

            const token = await optionsJWT.generateJWT({id: user.id, name, user_type: user.user_type});

            return {
                token
            };
        } catch (error) {
            return new InternalServerErrorException(`Something went wrong! ${error?.message}`);
        }
    }

    async generateProductKey(payload: generateProductKeyParams) {
        try {
            const key = `${payload.email}-${payload.user_type}-${process.env.PRODUCT_SECRET_KEY}`;

            return await bcrypt.hash(key, 12);
        } catch (error) {
            return new InternalServerErrorException(`Something went wrong! ${error?.message}`);
        }
    }
}
