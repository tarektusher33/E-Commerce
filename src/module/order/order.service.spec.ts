import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { Cart } from '../cart/entities/cart.entity';
import { Product } from '../product/entities/product.entity';
import { describe } from 'node:test';

const mockCartRepository = {
  find: jest.fn(),
  delete: jest.fn(),
};

const mockOrderRepository = {
  save: jest.fn(),
};

const mockProductRepository = {
  save: jest.fn(),
};

describe('OrderService', () => {
  let service: OrderService;
  let cartRepository: Repository<Cart>;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should place an order successfully', async () => {
    const createOrderDto: CreateOrderDto = {
      shippingAddress: '123 Street',
      phone: '1234567890',
    };
    const userId = 1;

    const cartItems = [
      {
        products: [
          { id: 1, productName: 'Product 1', stockQuantity: 10, price: 100, discountPrice: 10 },
        ],
        quantity: 2,
      },
    ];
    mockCartRepository.find.mockResolvedValue(cartItems);
    mockProductRepository.save.mockResolvedValue(null);
    mockOrderRepository.save.mockResolvedValue(null);
    mockCartRepository.delete.mockResolvedValue(null);

    const response = await service.createOrder(createOrderDto, userId);

    expect(response.statusCode).toBe(HttpStatus.CREATED);
    expect(response.message).toBe('Order placed successfully');
    expect(mockCartRepository.find).toHaveBeenCalledWith({ where: { userId }, relations: ['products'] });
    expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOrderRepository.save).toHaveBeenCalledTimes(1);
    expect(mockCartRepository.delete).toHaveBeenCalledWith({ userId });
  });

  it('should return error if no items in cart', async () => {
    const createOrderDto: CreateOrderDto = {
      shippingAddress: '123 Street',
      phone: '1234567890',
    };
    const userId = 1;

    mockCartRepository.find.mockResolvedValue([]);

    const response = await service.createOrder(createOrderDto, userId);

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.message).toBe('No items found in the cart');
  });

  it('should return error if insufficient stock', async () => {
    const createOrderDto: CreateOrderDto = {
      shippingAddress: '123 Street',
      phone: '1234567890',
    };
    const userId = 1;

    const cartItems = [
      {
        products: [
          { id: 1, productName: 'Product 1', stockQuantity: 1, price: 100, discountPrice: 10 },
        ],
        quantity: 2,
      },
    ];
    mockCartRepository.find.mockResolvedValue(cartItems);

    const response = await service.createOrder(createOrderDto, userId);

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response.message).toBe('Insufficient stock for product Product 1');
  });

  it('should return error if saving order fails', async () => {
    const createOrderDto: CreateOrderDto = {
      shippingAddress: '123 Street',
      phone: '1234567890',
    };
    const userId = 1;

    const cartItems = [
      {
        products: [
          { id: 1, productName: 'Product 1', stockQuantity: 10, price: 100, discountPrice: 10 },
        ],
        quantity: 2,
      },
    ];
    mockCartRepository.find.mockResolvedValue(cartItems);
    mockProductRepository.save.mockResolvedValue(null);
    mockOrderRepository.save.mockRejectedValue(new Error('Order save error'));

    const response = await service.createOrder(createOrderDto, userId);

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.message).toBe('Error occurred while placing order');
  });
});
