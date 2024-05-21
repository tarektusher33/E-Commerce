import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  userId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;

  price: number;
}
