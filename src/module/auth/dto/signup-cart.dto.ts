import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { IsCustomEmail } from 'src/common/validators/custom-email.validator';
import { UserRole } from 'src/utils/user-role.enum';

export class CreateSignUpDto {
  @ApiProperty({
    example: 'Tarek',
    type: 'string',
    description: 'Please enter your first name',
  })
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/, {
    message:
      'First name must start with a letter and must not contain any special characters',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Rahman',
    type: 'string',
    description: 'Please enter your last name',
  })
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/, {
    message:
      'Last name must start with a letter and must not contain any special characters',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'tarek@gmail.com',
    type: 'string',
    description: 'Please enter your valid email address',
  })
  @IsCustomEmail({ message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({
    example: '********',
    type: 'string',
    description: 'Please enter your Password',
  })
  password: string;

  @ApiProperty({
    example: 'user or admin',
    enum: UserRole,
    description: 'Please enter your role',
  })
  @Transform(({ value }) => value || UserRole.USER)
  @IsEnum(UserRole, {
    message: 'role must be one of the following values: user, admin',
  })
  role: UserRole;
}
