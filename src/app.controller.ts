import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller('app')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req : any ): string| any{
    const token = this.authService.generateToken(req.user);
    return `Access Token: ${token}`;
  }

  @Get('/test-accesstoken')
  @UseGuards(AuthGuard('jwt'))
  testAccessToken(): string {
    return 'This is my valid Access Token';
  }
}
