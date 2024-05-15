import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from 'src/product/product.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService,
    private readonly authService : AuthService,
    
  ) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Request() req) {
    const accessToken =  this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    if(!userId || !accessToken){
      throw new UnauthorizedException('Invalid token or user id');
    }
    return this.cartService.createCart(createCartDto, userId);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
