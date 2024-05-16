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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthService } from 'src/auth/auth.service';
import { Product } from './entities/product.entity';
import { GetProductsDto } from './dto/get-products-filter.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto, @Request() req) {
    const token = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid Token');
    }
    return this.productService.createProduct(createProductDto, userId);
  }

  @Get()
  getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() getProductsDto: GetProductsDto,
  ) {
    if (Object.keys(getProductsDto).length) {
      return this.productService.getProductsWithFilter(getProductsDto, page, limit);
    } else {
      return this.productService.getProducts();
    }
  }

  @Get('user-based')
  async getUserBasedProducts(@Request() req: any): Promise<Product[]> {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = this.authService.getUserIdFromAccessToken(accessToken);
    if (!userId) {
      throw new UnauthorizedException('Invalid access token');
    }
    return this.productService.findProductsByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const accessToken = await this.authService.extractAccessToken(req);
    const userId = await this.authService.getUserIdFromAccessToken(accessToken);
    return this.productService.remove(+id, userId);
  }
}
