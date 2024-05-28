import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
    description: 'Please enter discount price',
  })
  @IsNumber()
  @Transform (({value}) => value ?? 0)
  discountPrice: number;

  @ApiProperty({
    example: '0',
    type: 'number',
    description: 'Please enter stock quantity',
  })
  @IsNumber()
  stockQuantity: number;

  @ApiProperty({
    example: 'Product description',
    type: 'string',
    description: 'Please enter product description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'Product category',
    type: 'string',
    description: 'Please enter product category',
  })
  @IsString()
  category: string;
}
