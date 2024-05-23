import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateSignUpDto } from './dto/signup-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateLogInDto } from './dto/login-cart.dto';
import { createResponse } from 'src/utils/response.util';
import { User } from '../users/entities/user.entity';
import { ApiResponse } from 'src/common/interfaces/response.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUpUser(
    @Body() createSignUpDto: CreateSignUpDto,
    @Request() req,
  ): Promise<ApiResponse<User | null>> {
    try {
      const user = await this.authService.signUpUser(createSignUpDto, req.user);
      if (user) {
        return createResponse<User>(
          user,
          'Create User Successfully',
          HttpStatus.CREATED,
        );
      } else {
        return createResponse<null>(
          null,
          'Something went wrong',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
  
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(
    @Request() req: any,
    @Body() createLogInDto: CreateLogInDto,
  ): Promise<ApiResponse<string | null>> {
    try {
      const token = this.authService.generateToken(req.user);
      return createResponse<string>(token, 'Log In Successfull', HttpStatus.OK);
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}
