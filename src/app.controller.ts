import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './module/auth/auth.service';

@Controller('app')
export class AppController {
  
  constructor(private readonly authService: AuthService) {}
}
