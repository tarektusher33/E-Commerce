import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { GetProductsDto } from './dto/get-products-filter.dto';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../users/entities/user.entity';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { createResponse } from 'src/utils/response.util';
import { create } from 'domain';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    userId: number,
    imageUrl: string,
  ): Promise<ApiResponse<Product | null>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return createResponse<null>(
        null,
        `The user with the provided ID ${userId} does not exist in our records`,
        HttpStatus.NOT_FOUND,
        `User with ID ${userId} not found`,
      );
    }
    if (user.role == 'user') {
      return createResponse<null>(
        null,
        `Permisson Denied for create product`,
        HttpStatus.BAD_REQUEST,
        'User role does not have permission to create products',
      );
    }
    if (
      !createProductDto.productName ||
      createProductDto.productName.trim() === ''
    ) {
      return createResponse<null>(
        null,
        `Product name is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!createProductDto.price || createProductDto.price <= 0) {
      return createResponse<null>(
        null,
        `Price must be greater than zero`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!createProductDto.discountPrice || createProductDto.discountPrice < 0) {
      return createResponse<null>(
        null,
        `Price must be greater than zero`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!createProductDto.stockQuantity || createProductDto.stockQuantity < 0) {
      return createResponse<null>(
        null,
        `Quantity must be zero or greater`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const product: Product = new Product();
    product.productName = createProductDto.productName;
    product.price = createProductDto.price;
    product.discountPrice = createProductDto.discountPrice;
    product.category = createProductDto.category;
    product.description = createProductDto.description;
    product.stockQuantity = createProductDto.stockQuantity;
    product.imageUrl = imageUrl;
    product.user = user;
    await this.productRepository.save(product);
    return createResponse<Product>(
      product,
      'Product Created Successfully',
      HttpStatus.CREATED,
    );
  }

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findAllProducts(
    productQueryDto:ProductQueryDto
  ): Promise<any> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    if (productQueryDto.category) {
      queryBuilder.andWhere('product.category ILIKE  :category', { category: `%${productQueryDto.category }%`},);
    }
    if (productQueryDto.discountPrice) {
      queryBuilder.andWhere('product.discount = :discount', { discount: productQueryDto.discountPrice },);
    }
    if (productQueryDto.minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: productQueryDto.minPrice });
    }
    if (productQueryDto.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: productQueryDto.maxPrice });
    }
    if (productQueryDto.productName) {
      queryBuilder.andWhere('product.productName ILIKE :searchName', { searchName: `%${productQueryDto.productName}%` });
    }

    if (productQueryDto.description) {
      queryBuilder.andWhere('product.description ILIKE :searchDescription', { searchDescription: `%${productQueryDto.description}%` });
    }
    queryBuilder.orderBy('product.price', productQueryDto.sortDirection);
  queryBuilder.offset((productQueryDto.page - 1) * productQueryDto.limit).limit(productQueryDto.limit);

  const [products, total] = await queryBuilder.getManyAndCount();
  return [products, total];
  }

  async getUserBasedProducts(
    userId: number,
  ): Promise<ApiResponse<Product[] | null>> {
    try {
      const products = await this.productRepository.find({
        where: { user: { id: userId } },
      });
      if (products) {
        return createResponse<Product[]>(
          products,
          'Products are found',
          HttpStatus.OK,
        );
      } else {
        return createResponse<null>(
          null,
          'Something went wrong',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while getting product',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async findOne(id: number): Promise<Product> {
    let product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!product) {
      throw new UnauthorizedException('Product are not found');
    } else return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product | null>> {
    try {
      const productToUpdate: Product = await this.productRepository.findOne({
        where: { id },
      });
      if (!productToUpdate) {
        return createResponse<null>(
          null,
          'Product was not found',
          HttpStatus.NOT_FOUND,
        );
      }
      productToUpdate.productName = updateProductDto.productName;
      productToUpdate.price = updateProductDto.price;
      productToUpdate.stockQuantity = updateProductDto.stockQuantity;
      productToUpdate.description = updateProductDto.description;
      productToUpdate.category = updateProductDto.category;
      await this.productRepository.save(productToUpdate);
      return createResponse<Product>(
        productToUpdate,
        'Product Update Successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while updating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async remove(
    productId: number,
    userId: number,
  ): Promise<ApiResponse<Product | null>> {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: productId,
          user: { id: userId },
        },
        relations: ['user'],
      });
      if (!product) {
        return createResponse<null>(
          null,
          'Something went wrong',
          HttpStatus.BAD_REQUEST,
          'Product was not found or you do not have permission to delete it',
        );
      } else {
        await this.productRepository.delete(productId);
        return createResponse<Product>(
          product,
          'Product Deleted Successessfully',
          HttpStatus.OK,
        );
      }
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while updating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}
