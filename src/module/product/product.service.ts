import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductsDto } from './dto/get-products-filter.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ) {}

  async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (!createProductDto.productName || createProductDto.productName.trim() === '') {
      throw new BadRequestException('Product name is required');
    }
    if (!createProductDto.price || createProductDto.price <= 0) {
      throw new BadRequestException('Price must be greater than zero');
    }
    if (!createProductDto.discountPrice || createProductDto.discountPrice < 0) {
      throw new BadRequestException('Price must be greater than zero');
    }
    if (!createProductDto.stockQuantity || createProductDto.stockQuantity < 0) {
      throw new BadRequestException('Quantity must be zero or greater');
    }
    const product : Product = new Product();
    product.productName = createProductDto.productName;
    product.price = createProductDto.price;
    product.discountPrice = createProductDto.discountPrice;
    product.category = createProductDto.category;
    product.description = createProductDto.description;
    product.stockQuantity = createProductDto.stockQuantity;
    product.user = user;
    return this.productRepository.save(product);
  }
  

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async getProductsWithFilter(
    getProductsDto: GetProductsDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<Product>> {
    const { productName, description, category, minPrice, maxPrice } =
      getProductsDto;
    let query = this.productRepository.createQueryBuilder('product');
    if (productName) {
      const trimmedProductName = productName.trim();
      query = query.andWhere(
        'LOWER(product.productName) LIKE LOWER(:productName)',
        { productName: `%${trimmedProductName}%` },
      );
    }
    if (description) {
      const trimmedDescription = description.trim();
      query = query.andWhere(
        'LOWER(product.description) LIKE LOWER(:description)',
        { description: `%${trimmedDescription}%` },
      );
    }

    if (category) {
      query = query.andWhere('LOWER(product.category) = LOWER(:category)', {
        category,
      });
    }
    if (minPrice !== undefined) {
      query = query.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      query = query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    return paginate<Product>(query, { page, limit });
  }

  async getProductsByUserId(userId: number): Promise<Product[]> {
    const products = await this.productRepository.find({ where: {user : { id : userId }}, 
      
    });
    return products;
  }
  
  async findOne(id: number): Promise<Product> {
    let product = await this.productRepository.findOne({ where: { id } , relations : ['user']});
    if (!product) {
      throw new UnauthorizedException('Product are not found');
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
    productToUpdate.stockQuantity = updateProductDto.stockQuantity;
    productToUpdate.description = updateProductDto.description;
    productToUpdate.category = updateProductDto.category;
    return await this.productRepository.save(productToUpdate);
  }

  async remove(productId: number, userId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        user: { id: userId },
      },
      relations: ['user'],
    });
  
    if (!product) {
      throw new UnauthorizedException('Product was not found or you do not have permission to delete it');
    } else {
      await this.productRepository.delete(productId);
      return product;
    }
  }
  
}
