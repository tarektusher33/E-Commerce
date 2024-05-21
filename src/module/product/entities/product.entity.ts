
import { Cart } from 'src/module/cart/entities/cart.entity';
import { OrderItem } from 'src/module/order/entities/order-item.entity';
import { User } from 'src/module/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column()
  stockQuantity: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToMany(() => Cart, (cart) => cart.products)
  carts: Cart[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
