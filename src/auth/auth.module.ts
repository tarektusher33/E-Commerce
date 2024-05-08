import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';


@Module({
  imports: [PassportModule, UserModule],
  controllers: [],
  providers: [LocalStrategy],
})
export class AuthModule {

}
