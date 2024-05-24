import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Matches } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Mirpur Kazipara',
    type: 'string',
    description: 'Enter your Address',
  })
  @IsString()
  shippingAddress: string;
  
  @ApiProperty({
    example: '01*********',
    type: 'string',
    description: 'Enter your phone number',
  })
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Phone number must be a valid Bangladeshi mobile number',
  })
  phone: string;
}
