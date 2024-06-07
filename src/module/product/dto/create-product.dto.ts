import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  id: number;

  @ApiProperty({
    // example: 'Product Name',
    type: 'string',
    description: 'Please enter your product name',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    example: 0,
    type: 'number',
    description: 'Please enter product price',
  })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 0,
    type: 'number',
    description: 'Please enter discount price',
  })
  @IsNumber()
  @Type(() => Number)
  discountPrice: number;

  @ApiProperty({
    example: 0,
    type: 'number',
    description: 'Please enter stock quantity',
  })
  @IsNumber()
  @Type(() => Number)
  stockQuantity: number;

  @ApiProperty({
   // example: 'Product description',
    type: 'string',
    description: 'Please enter product description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
 //   example: 'Product category',
    type: 'string',
    description: 'Please enter product category',
  })
  @IsString()
  category: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Product image file',
    required: false,
  })
  file: any;
}
