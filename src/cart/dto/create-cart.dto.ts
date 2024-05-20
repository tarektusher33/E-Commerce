import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;
}
