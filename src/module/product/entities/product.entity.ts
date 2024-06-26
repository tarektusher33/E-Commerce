
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

  @Column({ nullable: true })
  discountPrice : number

  @Column()
  stockQuantity: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable : true})
  imageUrl: string;

  
  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToMany(() => Cart, (cart) => cart.products)
  carts: Cart[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
