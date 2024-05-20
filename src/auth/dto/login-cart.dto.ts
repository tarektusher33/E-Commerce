import { ApiProperty } from '@nestjs/swagger';

export class CreateLogInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
