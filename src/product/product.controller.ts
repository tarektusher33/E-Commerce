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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService,
    private readonly authService : AuthService
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const token = this.authService.extractAccessToken(req);
    const userId = this.authService.getUserIdFromAccessToken(token);
    if(!userId){
      throw new UnauthorizedException("Invalid Token");
    }
    return this.productService.create(createProductDto, userId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
