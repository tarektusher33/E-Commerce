import { Cart } from 'src/cart/entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
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
  quantity: number;

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
