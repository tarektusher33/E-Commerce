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
 
  @Column()
  productId : number;

  
  @ManyToMany(() => Product, (product) => product.carts, { cascade: true })
  @JoinTable()
  products: Product[];

  @Column({default : 0})
  quantity: number;

  @Column({default : 0})
  price: number;

  @Column({default : 0})
  discountPrice : number;
}
