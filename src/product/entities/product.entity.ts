import { Cart } from 'src/cart/entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
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
}
