import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { Order } from './entities/order.entity';
import { createResponse } from 'src/utils/response.util';

@Controller('orders')
@ApiTags('Order')
@ApiSecurity('JWT-auth')
@ApiBearerAuth('access token')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ): Promise<ApiResponse<Order | null>> {
    const userId = await this.getUserId(req);
    if (!userId) {
      return createResponse<null>(
        null,
        'Please log in first',
        HttpStatus.BAD_REQUEST,
      );
    }
    
    try {
      const order = await this.orderService.createOrder(createOrderDto, userId);
      if('message' in order){
        return createResponse<null> (
          null,
          order.message,
          HttpStatus.BAD_REQUEST
        )
      }
      if (order) {
        return createResponse<Order>(
          order,
          'Order Placement Successfully',
          HttpStatus.OK,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      )
    }
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
