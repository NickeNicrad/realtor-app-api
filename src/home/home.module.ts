import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UserInterceptor } from 'interceptors/user.interceptor';

@Module({
  imports: [PrismaModule],
  providers: [HomeService],
  controllers: [HomeController]
})
export class HomeModule {}
