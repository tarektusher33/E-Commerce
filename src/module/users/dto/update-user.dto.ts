import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({
    example: 'Tarek',
    type: 'string',
    description: 'Please enter your first name',
  })
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Tusher',
    type: 'string',
    description: 'Please enter your last name',
  })
  lastName?: string;

  @ApiProperty({
    example: '********',
    type: 'string',
    description: 'Please enter your password',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'user or admin',
    type: 'string',
    description: 'Please enter your role',
  })
  @Transform(({ value }) => value ?? 'user')
  role?: string;
}
