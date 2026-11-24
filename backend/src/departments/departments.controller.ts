
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { DepartmentsService } from './departments.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Departments')
@ApiBearerAuth('bearer')
@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all departments with employees',
  })
  @ApiOkResponse({
    description: 'Departments retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT authentication required',
  })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get department by ID with employees',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Department retrieved successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid department ID',
  })
  @ApiNotFoundResponse({
    description: 'Department not found',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT authentication required',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }
}
