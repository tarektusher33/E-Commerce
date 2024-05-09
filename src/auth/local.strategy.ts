import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({usernameField : "email"});
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    const isMatch = await bcrypt .compare(password, user.password);
    if (!user || !isMatch) {
      throw new UnauthorizedException('Invalid Username or Password');
    }
    return user;
  }
}
