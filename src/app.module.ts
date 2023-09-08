import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from './home/home.module';
import { MessageModule } from './message/message.module';
import { ImageModule } from './image/image.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { HomeService } from './home/home.service';

@Module({
  imports: [HomeModule, MessageModule, ImageModule, UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, HomeService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  }],
})
export class AppModule {}
