import {
  Injectable,
  NestMiddleware,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const baseURL = req.originalUrl;
      if (baseURL == '/users/signup') {
        return next();
      }
      const token = this.authService.extractAccessToken(req);
      const payload = this.jwtService.verify(token);
      req['user'] = payload;
      const role = payload.role;

      if (role == 'admin') {
        next();
      } else if (role == 'user') {
        const method = req.method;
        if (method == 'GET') {
          next();
        } else {
          throw new UnauthorizedException(
            'You do not have permission to perform this action.',
          );
        }
      }
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid token OR You do not have permission to perform this action.',
      );
    }
  }
}
