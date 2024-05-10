import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Product {

    @PrimaryGeneratedColumn()
    id : number;

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
