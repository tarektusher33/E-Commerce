import { ApiProperty } from '@nestjs/swagger';
import { IsCustomEmail } from 'src/common/validators/custom-email.validator';

export class CreateLogInDto {
  @ApiProperty({
    example: 'Tarek@gmail.com',
    type: 'string',
    description: 'Please enter your valid email',
  })
  @IsCustomEmail({ message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({
    example: '******',
    type: 'string',
    description: 'Please enter your valid password',
  })
  password: string;
}
