import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Cart } from './entities/cart.entity';
import { createResponse } from 'src/utils/response.util';

@Controller('cart')
@ApiTags('Cart')
@ApiSecurity('JWT-auth')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
  ) {}

  getUserId(req): number {
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    return userId;
  }

  @ApiBearerAuth('access token')
  @Post()
  async createCart(
    @Body() createCartDto: CreateCartDto,
    @Request() req,
  ): Promise<ApiResponse<Cart | null>> {
    const userId = this.getUserId(req);
    return await this.cartService.createCart(createCartDto, userId);
  }

  @ApiBearerAuth('access token')
  @Patch(':id')
  updateCart(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<ApiResponse<Cart | null>> {
    return this.cartService.updateCart(+id, updateCartDto);
  }

  @ApiBearerAuth('access token')
  @Delete(':id')
  async removeCart(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<Cart | null>> {
    const userId = this.getUserId(req);
    return await this.cartService.removeCart(+id, userId);
  }


  @ApiBearerAuth('access token')
  @Get()
  findAllCarts(@Request() req): Promise<ApiResponse<Cart[] | null>> {
    const userId = this.getUserId(req);
    return this.cartService.findAllCarts(userId);
  }
}
