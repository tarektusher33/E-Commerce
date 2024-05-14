import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    userId : number;
    
    @Column()
    productName : string;

    @Column()
    price : number;

    @Column()
    quantity : number;

    @Column()
    description : string;

    @Column()
    category : string;
}
