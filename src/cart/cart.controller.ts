import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from 'src/product/product.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Request() req) {
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    if (!userId || !accessToken) {
      throw new UnauthorizedException('Invalid token or user id');
    }
    return this.cartService.createCart(createCartDto, userId);
  }

  @Patch(':id')
  updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(+id, updateCartDto);
  }

  @Delete(':id')
  removeCart(@Param('id') id: string) {
    return this.cartService.removeCart(+id);
  }
}
