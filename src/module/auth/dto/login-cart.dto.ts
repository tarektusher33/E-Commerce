import { ApiProperty } from '@nestjs/swagger';
import { IsCustomEmail } from 'src/common/validators/custom-email.validator';

export class CreateLogInDto {
  @ApiProperty()
  @IsCustomEmail({ message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty()
  password: string;
}
