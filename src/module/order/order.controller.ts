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
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({summary : 'Create a Order'})
  async createOrder(
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
    return await this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  @ApiOperation({summary : 'Find all order'})
  findAllOrders(@Request() req): Promise<ApiResponse<Order[]>> {
    const userId = this.getUserId(req);
    return this.orderService.findAllOrders(userId);
  }

  getUserId(req) {
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    return userId;
  }
}
