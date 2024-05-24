import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    example: '1',
    type: 'number',
    description: 'Please enter the product id',
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    example: '1',
    type: 'number',
    description: 'Please enter the quantity',
  })
  @IsInt()
  quantity: number;

}
