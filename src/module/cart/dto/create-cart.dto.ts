import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'Product Number',
    type: 'Number',
    description: 'Please enter  product id',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 'Quantity',
    type: 'number',
    description: 'Please enter Quantity',
  })
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}
