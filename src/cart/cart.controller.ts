import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('cart')
@ApiTags('Cart')
@ApiSecurity('JWT-auth')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
  ) {}

  getUserId(req) : number{
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    return userId;
  }

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Request() req) {
    const userId = this.getUserId(req);
    if (!userId) {
      throw new BadRequestException();
    }
    return this.cartService.createCart(createCartDto, userId);
  }

  @Patch(':id')
  updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(+id, updateCartDto);
  }

  @Delete(':id')
  removeCart(@Param('id') id: string, @Request() req) {
    const userId = this.getUserId(req);
    return this.cartService.removeCart(+id, userId);
  }

  @Delete('remove-item/:id')
  removeItemFromCart(@Param('id') id : string, @Request() req, @Body() removeCartDto : CreateCartDto){
    const userId = this.getUserId(req);
    return this.cartService.removeItemFromCart(removeCartDto, +id, userId);
  }

  @Get()
  findAllCarts(){
    return this.cartService.findAllCarts();
  }
}
