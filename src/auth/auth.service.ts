import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  generateToken(payload: CreateUserDto): string {
    return this.jwtService.sign(JSON.parse(JSON.stringify(payload)));
  }

  extractAccessToken(req : any): string | null {
    
    if (req.headers && req.headers['authorization']) {
     const authHeader = req.headers['authorization'];
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
    }
   return null;
  }

  getUserIdFromAccessToken(accessToken: string): number | null {
    try {
      const payload = this.jwtService.verify(accessToken);
      if (payload && payload.id) {
        return payload.id;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}
