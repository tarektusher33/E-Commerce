import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { IsCustomEmail } from 'src/common/validators/custom-email.validator';

export class CreateSignUpDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsCustomEmail({ message: 'Please enter a valid email address' })
  @IsString()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value ?? 'user')
  role: string;
}
