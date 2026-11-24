
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity.js';
import { Department } from '../departments/entities/department.entity.js';

export interface DeleteEmployeeResult {
  message: string;
  employee: Employee;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  role: string;
  departmentId: number;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

async findAll(): Promise<Employee[]> {
  return this.employeeRepository.find({
    relations: {
      department: true,
    },
  });
}

  // GET employee by ID
  async findOne(id: number): Promise<Employee> {
  const employee = await this.employeeRepository.findOne({
    where: { id },
    relations: {
      department: true,
    },
  });

  if (!employee) {
    throw new NotFoundException(`Employee ${id} not found`);
  }

  return employee;
}
  // POST create employee
  async create(data: CreateEmployeeData): Promise<Employee> {
    const department = await this.departmentRepository.findOne({
      where: { id: data.departmentId },
    });

    if (!department) {
      throw new NotFoundException(
        `Department ${data.departmentId} not found`,
      );
    }

    const employee = this.employeeRepository.create({
      name: data.name,
      email: data.email,
      role: data.role,
      department,
    });

    return this.employeeRepository.save(employee);
  }

  // PUT update complete employee
  async update(
    id: number,
    data: CreateEmployeeData,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    const department = await this.departmentRepository.findOne({
      where: { id: data.departmentId },
    });

    if (!department) {
      throw new NotFoundException(
        `Department ${data.departmentId} not found`,
      );
    }

    employee.name = data.name;
    employee.email = data.email;
    employee.role = data.role;
    employee.department = department;

    return this.employeeRepository.save(employee);
  }

  // PATCH update employee role
  async updateRole(id: number, role: string): Promise<Employee> {
    const employee = await this.findOne(id);

    employee.role = role;

    return this.employeeRepository.save(employee);
  }

  // DELETE employee
  async remove(id: number): Promise<DeleteEmployeeResult> {
    const employee = await this.findOne(id);

    await this.employeeRepository.remove(employee);

    return {
      message: 'Employee deleted successfully',
      employee,
    };
  }
}
