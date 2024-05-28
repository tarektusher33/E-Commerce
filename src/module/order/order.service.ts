import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { ProductService } from '../product/product.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { createResponse } from 'src/utils/response.util';
import { ApiResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productService: ProductService,
  ) {}
  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<ApiResponse<Order>> {
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['products'],
    });
    if (cartItems.length === 0) {
      return createResponse<null>(
        null,
        'No items found in the cart',
        HttpStatus.NOT_FOUND,
      );
    }

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];
    for (const cartItem of cartItems) {
      for (const product of cartItem.products) {
        if (product.stockQuantity < cartItem.quantity) {
          return createResponse<null>(
            null,
            `Insufficient stock for product ${product.productName}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = cartItem.quantity;
        orderItem.price = product.price * cartItem.quantity;
        orderItem.discountPrice += product.discountPrice;
        orderItems.push(orderItem);
        // Decrease the product's stock quantity
        product.stockQuantity -= cartItem.quantity;
        await this.productRepository.save(product);
        totalAmount += orderItem.price;
      }
    }

    const order = new Order();
    order.userId = userId;
    order.orderItems = orderItems;
    order.totalAmount = totalAmount;
    order.shippingAddress = createOrderDto.shippingAddress;
    order.phone = createOrderDto.phone;

    try {
      await this.orderRepository.save(order);
      await this.cartRepository.delete({ userId });
      return createResponse<Order>(
        order,
        'Order placed successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while placing order',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async findAllOrders(userId: number): Promise<ApiResponse<Order[]>> {
    try {
      const orders = await this.orderRepository.find({
        where: { userId },
        relations: ['orderItems', 'orderItems.product'],
      });

      if (!orders.length) {
        return createResponse<null>(
          null,
          'No orders found for this user',
          HttpStatus.NOT_FOUND,
        );
      } else {
        return createResponse<Order[]>(
          orders,
          'Orders found successfully',
          HttpStatus.FOUND,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while placing order',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}
