import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordEntityDto } from './entities/password.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from '../users/users.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([PasswordEntityDto]),
    MailerModule.forRoot({
      transport : {
        host : '0.0.0.0',
        port : 1025
      },
      defaults : {
        from : "admin@example.com"
      }
    }),
    UsersModule
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
