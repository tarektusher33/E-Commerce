import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  id: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stockQuantity: number;

  @ApiProperty()
  description: string;
  
  @ApiProperty()
  category: string;
}
