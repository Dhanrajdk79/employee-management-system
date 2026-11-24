
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Registered email address',
    example: 'dhanraj@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Password123!',
    format: 'password',
    writeOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
