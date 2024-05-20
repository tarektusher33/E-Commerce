import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller('app')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  

  @Get('/test-accesstoken')
  @UseGuards(AuthGuard('jwt'))
  testAccessToken(): string {
    return 'This is my valid Access Token';
  }
}
