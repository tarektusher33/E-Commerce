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
    if (!userId) {
      return createResponse<null>(null, 'Please log in', HttpStatus.NOT_FOUND);
    }

    try {
      const cart = await this.cartService.createCart(createCartDto, userId);
      if ('message' in cart) {
        return createResponse<null>(null, cart.message, HttpStatus.BAD_REQUEST);
      }
      if (cart) {
        return createResponse<Cart>(
          cart,
          'Added item successfully in the cart',
          HttpStatus.OK,
        );
      } else {
        return createResponse<null>(
          null,
          'Something went wrong for createing cart',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Patch(':id')
  updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(+id, updateCartDto);
  }

  @Delete(':id')
  async removeCart(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<Cart | null>> {
    const userId = this.getUserId(req);
    if (!userId) {
      return createResponse<null>(null, 'Please log in', HttpStatus.NOT_FOUND);
    }
    try {
      const cart = await this.cartService.removeCart(+id, userId);
      if ('message' in cart) {
        return createResponse<null>(null, cart.message, HttpStatus.NOT_FOUND);
      }
      if (cart) {
        return createResponse<Cart>(
          cart,
          'Remove Cart Successfully',
          HttpStatus.OK,
        );
      } else {
        return createResponse<null>(
          null,
          'Something went wrong for removing cart',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Delete('remove-item/:id')
  async removeItemFromCart(
    @Param('id') id: string,
    @Request() req,
    @Body() removeCartDto: CreateCartDto,
  ) : Promise<ApiResponse<Cart | string>>{
    try {
      const userId = this.getUserId(req);
      const cartItem = await this.cartService.removeItemFromCart(
        removeCartDto,
        +id,
        userId,
      );
      if('message' in cartItem){
        return createResponse<null> (
          null,
          cartItem.message,
          HttpStatus.NOT_FOUND
        )
      }
      if(cartItem){
        return createResponse<Cart> (
          cartItem,
          'Cart item removed successfully',
          HttpStatus.OK
        )
      }
      else{
        return createResponse<Cart> (
          null,
          'Somthing went wrong for removing item',
          HttpStatus.BAD_REQUEST
        )
      }
    } catch (error) {
      return createResponse<Cart> (
        null,
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get()
  findAllCarts() {
    return this.cartService.findAllCarts();
  }
}
