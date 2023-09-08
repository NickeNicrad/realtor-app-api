import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JSON_SECRET_KEY,
    })
  ],
  providers: [UserService, AuthService],
  controllers: [UserController, AuthController]
})
export class UserModule {}
