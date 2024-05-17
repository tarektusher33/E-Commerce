import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, TableForeignKey } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToMany(()=>Product, Product => Product.cart)
  products: Product[];

  @Column()
  quantity: number;

  @Column()
  price: number;

  // @OneToMany(() => Product, product => product.cart)
  // products: Product[];
}
