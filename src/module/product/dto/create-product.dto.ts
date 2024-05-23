import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  id: number;

  @ApiProperty({
    example: 'Product Name',
    type: 'string',
    description: 'Please enter your product name',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    example: '0',
    type: 'number',
    description: 'Please enter product price',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '0',
    type: 'number',
    description: 'Please enter stock quantity',
  })
  stockQuantity: number;

  @ApiProperty({
    example: 'Product description',
    type: 'string',
    description: 'Please enter product description',
  })
  description: string;

  @ApiProperty({
    example: 'Product category',
    type: 'string',
    description: 'Please enter product category',
  })
  category: string;
}
