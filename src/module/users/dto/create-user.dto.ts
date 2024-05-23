import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsCustomEmail } from 'src/common/validators/custom-email.validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Tarek ',
    type: 'string',
    description: 'Please enter your first name',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Rahman',
    type: 'string',
    description: 'Please enter your last name',
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
    type: 'string',
    description: 'Please enter your role',
  })
  @IsString() 
  @Transform(({ value }) => value ?? 'user')
  role: string;
}
