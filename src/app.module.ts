import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { loadEnvFile } from 'process';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.local.env',
      isGlobal : true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
