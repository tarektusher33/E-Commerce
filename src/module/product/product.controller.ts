import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { GetProductsDto } from './dto/get-products-filter.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { createResponse } from 'src/utils/response.util';

@Controller('products')
@ApiTags('Product')
@ApiSecurity('JWT-auth')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth('access-token')
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ): Promise<ApiResponse<Product | null>> {
    const token = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(token);
    if (!userId) {
      throw new UnauthorizedException();
    }
    try {
      const product = await this.productService.createProduct(
        createProductDto,
        userId,
      );
      return product;
    } catch (error) {
      return createResponse<null>(
        null,
        'Error occurred while creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @Get()
  getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() getProductsDto: GetProductsDto,
  ) {
    if (Object.keys(getProductsDto).length) {
      return this.productService.getProductsWithFilter(
        getProductsDto,
        page,
        limit,
      );
    } else {
      return this.productService.getProducts();
    }
  }

  @ApiBearerAuth('access-token')
  @Get('user-based')
  async getUserBasedProducts(
    @Request() req: any,
  ): Promise<ApiResponse<Product[] | null>> {
    const accessToken = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    if (!userId) {
      throw new UnauthorizedException();
    }
    const products = await this.productService.getUserBasedProducts(userId);
    return products;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Product | null>> {
    try {
      const product = await this.productService.findOne(+id);
      if (product) {
        return createResponse<Product>(
          product,
          'Products are found',
          HttpStatus.OK,
        );
      } else {
        return createResponse<null>(
          null,
          'Product are not found',
          HttpStatus.NOT_FOUND,
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

  @ApiBearerAuth('access-token')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ): Promise<ApiResponse<Product | null>> {
    const token = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(token);
    if (!userId) {
      return createResponse<null>(
        null,
        'User not Found',
        HttpStatus.NOT_FOUND,
        `The user with the provided ID ${userId} does not exist in our records`,
      );
    }
    const product = await this.productService.update(+id, updateProductDto);
    return product;
  }

  @ApiBearerAuth('access-token')
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<Product | null>> {
    const accessToken = await this.authService.extractAccessToken(req);
    const userId = await this.authService.getUserIdFromAccessToken(accessToken);
    const rmvProduct = await this.productService.remove(+id, userId);
    return rmvProduct;
  }
}
