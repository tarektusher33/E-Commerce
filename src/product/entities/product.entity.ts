import { Cart } from 'src/cart/entities/cart.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  
  @ManyToOne(() => Cart, cart => cart.products)
  cart: Cart;
}
