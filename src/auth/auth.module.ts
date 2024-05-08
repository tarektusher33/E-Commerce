import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [PassportModule, UserModule],
  controllers: [],
  providers: [],
})
export class AuthModule {

}
