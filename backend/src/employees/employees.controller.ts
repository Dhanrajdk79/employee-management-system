
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseBoolPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { EmployeesService } from './employees.service.js';
import { Employee } from './entities/employee.entity.js';
import type { DeleteEmployeeResult } from './employees.service.js';

import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto.js';

import { PositiveNumberPipe } from '../common/pipes/positive-number/positive-number.pipe.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { LoggingInterceptor } from '../common/interceptors/logging/logging.interceptor.js';
import { ResponseTransformInterceptor } from '../common/interceptors/response-transform/response-transform.interceptor.js';

@ApiTags('Employees')
@ApiBearerAuth('bearer')
@UseInterceptors(
  LoggingInterceptor,
  ResponseTransformInterceptor,
)
@UseGuards(JwtAuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  // GET all employees
  @Get()
  @ApiOperation({
    summary: 'Get all employees',
  })
  @ApiOkResponse({
    description: 'Employees retrieved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'JWT authentication required',
  })
  async findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  // GET employee active status
  @Get('active')
  @ApiOperation({
    summary: 'Check employee active status',
  })
  @ApiQuery({
    name: 'status',
    required: true,
    type: Boolean,
    example: true,
    description: 'Employee active status',
  })
  @ApiOkResponse({
    description: 'Employee status returned',
  })
  @ApiBadRequestResponse({
    description: 'Invalid status parameter',
  })
  getActiveStatus(
    @Query('status', ParseBoolPipe) status: boolean,
  ) {
    return {
      status,
      message: status
        ? 'Employees are active'
        : 'Employees are inactive',
    };
  }

  // GET employee by ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get employee by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Employee retrieved successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid employee ID',
  })
  @ApiNotFoundResponse({
    description: 'Employee not found',
  })
  async findOne(
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<Employee> {
    return this.employeesService.findOne(id);
  }

  // GET UUID validation
  @Get('uuid/:id')
  @ApiOperation({
    summary: 'Validate UUID parameter',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Valid UUID received',
  })
  @ApiBadRequestResponse({
    description: 'Invalid UUID format',
  })
  testUUID(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return {
      message: 'Valid UUID received',
      id,
    };
  }

  // POST create employee
  @Post()
  @ApiOperation({
    summary: 'Create a new employee',
  })
  @ApiCreatedResponse({
    description: 'Employee created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid employee data',
  })
  @ApiNotFoundResponse({
    description: 'Department not found',
  })
  async create(
    @Body() body: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.create(body);
  }

  // PUT update complete employee
  @Put(':id')
  @ApiOperation({
    summary: 'Update employee details',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Employee updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid employee data or ID',
  })
  @ApiNotFoundResponse({
    description: 'Employee or department not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.employeesService.update(id, body);
  }

  // PATCH update employee role
  @Patch(':id/role')
  @ApiOperation({
    summary: 'Update employee role',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Employee role updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid employee ID or role',
  })
  @ApiNotFoundResponse({
    description: 'Employee not found',
  })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmployeeRoleDto,
  ): Promise<Employee> {
    return this.employeesService.updateRole(
      id,
      body.role,
    );
  }

  // DELETE employee - Admin only
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Delete an employee (Admin only)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Employee deleted successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required',
  })
  @ApiForbiddenResponse({
    description: 'Admin role required',
  })
  @ApiNotFoundResponse({
    description: 'Employee not found',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteEmployeeResult> {
    return this.employeesService.remove(id);
  }
}
