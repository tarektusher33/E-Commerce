import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  description: string;
  
  @ApiProperty()
  category: string;
}
