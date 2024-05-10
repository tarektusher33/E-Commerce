import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product: Product = new Product();
    product.productName = createProductDto.productName;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.description = createProductDto.description;
    product.category = createProductDto.category;
    await this.productRepository.save(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    let product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new UnauthorizedException('Product was not found');
    } else return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productToUpdate: Product = await this.productRepository.findOne({
      where: { id },
    });
    if (!productToUpdate) {
      throw new UnauthorizedException('Product was not found');
    }
    productToUpdate.productName = updateProductDto.productName;
    productToUpdate.price = updateProductDto.price;
    productToUpdate.quantity = updateProductDto.quantity;
    productToUpdate.description = updateProductDto.description;
    productToUpdate.category = updateProductDto.category;
    return await this.productRepository.save(productToUpdate);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new UnauthorizedException('Product was not found');
    } else {
      await this.productRepository.delete(id);
      return 'Product delete successfully';
    }
  }
}
