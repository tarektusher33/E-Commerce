import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Order')
@ApiSecurity('JWT-auth')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const userId = this.getUserId(req);
    return this.orderService.createOrder(createOrderDto, userId);
  }
  @Get()
  findAll(@Request() req) {
    const userId = this.getUserId(req);
    return this.orderService.findAllOrders(userId);
  }
  getUserId(req) {
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    return userId;
  }
}
