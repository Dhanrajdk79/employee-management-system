
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { EmployeesService } from './employees.service.js';
import type { Employee } from './entities/employee.entity.js';
import type { Department } from '../departments/entities/department.entity.js';

describe('EmployeesService', () => {
  let service: EmployeesService;

  const employeeRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const departmentRepository = {
    findOne: vi.fn(),
  };

  const department = {
    id: 1,
    name: 'Development',
    employees: [],
  } as Department;

  const employee = {
    id: 1,
    name: 'Test Employee',
    email: 'test@example.com',
    role: 'Developer',
    department,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Employee;

  beforeEach(() => {
    vi.clearAllMocks();

    service = new EmployeesService(
      employeeRepository as unknown as Repository<Employee>,
      departmentRepository as unknown as Repository<Department>,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all employees with their departments', async () => {
    employeeRepository.find.mockResolvedValue([employee]);

    const result = await service.findAll();

    expect(result).toEqual([employee]);
    expect(employeeRepository.find).toHaveBeenCalledWith({
      relations: { department: true },
    });
  });

  it('should return an employee by ID', async () => {
    employeeRepository.findOne.mockResolvedValue(employee);

    const result = await service.findOne(1);

    expect(result).toEqual(employee);
    expect(employeeRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { department: true },
    });
  });

  it('should throw NotFoundException when employee does not exist', async () => {
    employeeRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create an employee with an existing department', async () => {
    departmentRepository.findOne.mockResolvedValue(department);
    employeeRepository.create.mockReturnValue(employee);
    employeeRepository.save.mockResolvedValue(employee);

    const data = {
      name: 'Test Employee',
      email: 'test@example.com',
      role: 'Developer',
      departmentId: 1,
    };

    const result = await service.create(data);

    expect(departmentRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(employeeRepository.create).toHaveBeenCalledWith({
      name: data.name,
      email: data.email,
      role: data.role,
      department,
    });

    expect(employeeRepository.save).toHaveBeenCalledWith(employee);
    expect(result).toEqual(employee);
  });

  it('should reject employee creation when department does not exist', async () => {
    departmentRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        name: 'Test Employee',
        email: 'test@example.com',
        role: 'Developer',
        departmentId: 999,
      }),
    ).rejects.toThrow('Department 999 not found');

    expect(employeeRepository.save).not.toHaveBeenCalled();
  });

  it('should update an employee', async () => {
    employeeRepository.findOne.mockResolvedValue({ ...employee });
    departmentRepository.findOne.mockResolvedValue(department);
    employeeRepository.save.mockImplementation(async (value) => value);

    const data = {
      name: 'Updated Employee',
      email: 'updated@example.com',
      role: 'Senior Developer',
      departmentId: 1,
    };

    const result = await service.update(1, data);

    expect(result.name).toBe(data.name);
    expect(result.email).toBe(data.email);
    expect(result.role).toBe(data.role);
    expect(result.department).toEqual(department);
    expect(employeeRepository.save).toHaveBeenCalled();
  });

  it('should update an employee role', async () => {
    const existingEmployee = { ...employee };

    employeeRepository.findOne.mockResolvedValue(existingEmployee);
    employeeRepository.save.mockImplementation(async (value) => value);

    const result = await service.updateRole(1, 'Team Lead');

    expect(result.role).toBe('Team Lead');
    expect(employeeRepository.save).toHaveBeenCalledWith(
      existingEmployee,
    );
  });

  it('should delete an employee', async () => {
    employeeRepository.findOne.mockResolvedValue(employee);
    employeeRepository.remove.mockResolvedValue(employee);

    const result = await service.remove(1);

    expect(employeeRepository.remove).toHaveBeenCalledWith(employee);
    expect(result).toEqual({
      message: 'Employee deleted successfully',
      employee,
    });
  });
});
