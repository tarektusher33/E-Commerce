import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { ProductService } from '../product/product.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly productService: ProductService,
  ) {}
  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order> {
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['products'],
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('No items found in the cart');
    }
    
    let totalAmount = 0;
    for (const cartItem of cartItems) {
      totalAmount += cartItem.price;
    }

    const orderItems: OrderItem[] = [];
    for (const cartItem of cartItems) {
      for (const product of cartItem.products) {
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = cartItem.quantity;
        orderItem.price = product.price * cartItem.quantity;
        orderItems.push(orderItem);
      }
    }
    const order = new Order();
    order.userId = userId;
    order.user = { id: userId } as User;
    order.orderItems = orderItems;
    order.totalAmount = totalAmount;
    const savedOrder = await this.orderRepository.save(order);
    await this.cartRepository.delete({ userId });
    return savedOrder;
  }

  async findAllOrders(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!orders.length) {
      throw new NotFoundException('No orders found for this user');
    }

    return orders;
  }
}
