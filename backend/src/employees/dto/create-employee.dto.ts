
import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Employee full name',
    example: 'Rahul Sharma',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'rahul@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Employee job role',
    example: 'Backend Developer',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  role: string;

  @ApiProperty({
    description: 'ID of the existing department',
    example: 1,
    type: Number,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  departmentId: number;
}
