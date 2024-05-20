import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateLogInDto } from './dto/login-cart.dto';
import { CreateSignUpDto } from './dto/signup-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUpUser(@Body() createSignUpDto : CreateSignUpDto, @Request() req) {
    return this.authService.signUpUser(createSignUpDto,req.user);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req : any ): string| any{
    const token = this.authService.generateToken(req.user);
    return `Access Token: ${token}`;
  }
}
