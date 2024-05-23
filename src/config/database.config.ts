import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from 'src/module/cart/entities/cart.entity';
import { OrderItem } from 'src/module/order/entities/order-item.entity';
import { Order } from 'src/module/order/entities/order.entity';
import { PasswordEntityDto } from 'src/module/password/entities/password.entity';
import { Product } from 'src/module/product/entities/product.entity';
import { User } from 'src/module/users/entities/user.entity';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Order, Cart, OrderItem, PasswordEntityDto, Product],
  synchronize: configService.get<boolean>('DB_SYNC'),
});
