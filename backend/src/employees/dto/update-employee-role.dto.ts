
import {
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeRoleDto {
  @ApiProperty({
    description: 'New employee job role',
    example: 'Senior AWS DevOps Engineer',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  role: string;
}
