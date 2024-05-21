import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsCustomEmail } from 'src/common/validators/custom-email.validator';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsCustomEmail({ message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: string;
}
