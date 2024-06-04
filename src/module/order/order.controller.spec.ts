import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';


describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  describe('findAllOrders', () => {
    it('should return an array of orders', async () => {
      const result: any = {
        data: [
          {
            id: 1,
            userId: 1,
            totalPrice: 100,
            totalDiscount: 10,
            totalPriceAfterDiscount: 90,
            orderDate: new Date(),
            shippingAddress: 'Address',
            phone: '01234567890',
            orderItems: [],
            user: {} as any,
          },
        ],
        message: 'Orders retrieved successfully',
        error: null,
        statusCode: 200,
      };

      jest.spyOn(orderService, 'findAllOrders').mockImplementation(async () => result);

      const req = { user: { id: 1 } };
      expect(await orderController.findAllOrders(req)).toBe(result);
    });
  });
});
