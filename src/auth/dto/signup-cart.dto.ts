import { ApiProperty } from '@nestjs/swagger';
import { IsCustomEmail } from 'src/common/validators/custom-email.validator';

export class CreateSignUpDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @IsCustomEmail({message : 'Please enter a valid email address'})
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: string;
}
