import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }
  validate(userName: string, password: string): User {
    const user: User = this.userService.getUserByUserName(userName);
    if (user == undefined) throw new UnauthorizedException();
    if (user != undefined && user.password == password) return user;
    else throw new UnauthorizedException();
  }
}
