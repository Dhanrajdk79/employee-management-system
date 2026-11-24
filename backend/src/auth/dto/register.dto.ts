
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Dhanraj Kshirsagar',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Unique email address',
    example: 'dhanraj@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Account password (8–50 characters)',
    example: 'Password123!',
    minLength: 8,
    maxLength: 50,
    format: 'password',
    writeOnly: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}
