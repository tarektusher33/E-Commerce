import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { loadEnvFile } from 'process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { ProductModule } from './module/product/product.module';
import { PasswordModule } from './module/password/password.module';
import { CartModule } from './module/cart/cart.module';
import { OrderModule } from './module/order/order.module';
import { databaseConfig } from './config/database.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemoveSensitiveUserInfoInterceptor } from './interceptors/filter-user-response.interceptor';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.local.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        databaseConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    ProductModule,
    PasswordModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RemoveSensitiveUserInfoInterceptor,
    },
  ],
})
export class AppModule {}
