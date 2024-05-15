import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ nullable: false })
    userId : number;
    
    @Column()
    productName : string;

    @Column()
    price : number;

    @Column()
    quantity : number;

    @Column({ nullable: true })
    description : string;

    @Column({ nullable: true })
    category : string;
}
