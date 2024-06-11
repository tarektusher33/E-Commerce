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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { GetProductsDto } from './dto/get-products-filter.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { createResponse } from 'src/utils/response.util';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/config/multer.config';
import { Throttle } from '@nestjs/throttler';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('products')
@ApiTags('Product')
@ApiSecurity('JWT-auth')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly multerConfig: MulterConfig,
  ) {}

  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file', new MulterConfig().createMulterOptions()))
  @ApiOperation({ summary: 'Create a Product' })
  @ApiConsumes("multipart/form-data")
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ApiResponse<Product | null>> {
    const token = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(token);
    if (!userId) {
      throw new UnauthorizedException();
    }
    if (!file) {
      return createResponse<null>(
        null,
        'No file uploaded',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const imageUrl = file.path
      const product = await this.productService.createProduct(
        createProductDto,
        userId,
        imageUrl
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
  @ApiOperation({ summary: 'Search Product' })
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async findAll(@Query()productQueryDto:ProductQueryDto):Promise<{data:Product[],total:number}> {
    const [products,total]= await this.productService.findAllProducts(productQueryDto);
    return {data:products,total};
  }


  @ApiBearerAuth('access-token')
  @Get('user-based')
  @ApiOperation({ summary: 'Get user based product' })
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
  @ApiOperation({ summary: 'Get single product' })
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
  @ApiOperation({ summary: 'Update a Product' })
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
  @ApiOperation({ summary: 'Delete a Product' })
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
