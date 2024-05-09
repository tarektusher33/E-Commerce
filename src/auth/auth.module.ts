import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UsersModule),
    ConfigModule.forRoot({
      envFilePath: '.local.env',
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.key,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
