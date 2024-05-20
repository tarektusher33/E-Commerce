import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateSignUpDto } from './dto/signup-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateLogInDto } from './dto/login-cart.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUpUser(@Body() createSignUpDto: CreateSignUpDto, @Request() req) {
    return this.authService.signUpUser(createSignUpDto, req.user);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  async login(
    @Request() req: any,
    @Body() createLogInDto: CreateLogInDto,
  ): Promise<{ message: string; accessToken: string }> {
    const token = this.authService.generateToken(req.user);
    return {
      message: 'Login Successful',
      accessToken: token,
    };
  }
}
