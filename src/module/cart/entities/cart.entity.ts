import { Product } from 'src/module/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToMany(() => Product, (product) => product.carts, { cascade: true })
  @JoinTable()
  products: Product[];

  @Column()
  quantity: number;

  @Column()
  price: number;
}
