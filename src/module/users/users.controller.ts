import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Req,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { User } from './entities/user.entity';
import { createResponse } from 'src/utils/response.util';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  create(@Body() createUserDto: CreateUserDto, @Request() req) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<User | null>> {
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    if (userId !== +id) {
      throw new UnauthorizedException('User Id does not match');
    }
    try {
      const user = await this.usersService.findOne(+id);
      if (user) {
        return createResponse<User>(
          user,
          'User found Successfully',
          HttpStatus.OK,
        );
      } else {
        return createResponse<null>(
          null,
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Something went wrong',
        HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<ApiResponse<User | null>> {
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    if (userId !== +id) {
      throw new UnauthorizedException('User Id does not match');
    }
    try {
      const user = await this.usersService.updateUser(+id, updateUserDto);
      if (user) {
        return createResponse<User>(
          user,
          'User update Successfully',
          HttpStatus.OK,
        );
      } else {
        return createResponse<null>(
          null,
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Something went wrong',
        HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }
}
