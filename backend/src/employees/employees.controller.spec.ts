
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmployeesController } from './employees.controller.js';
import type { EmployeesService } from './employees.service.js';

describe('EmployeesController', () => {
  let controller: EmployeesController;

  const employeesService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateRole: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new EmployeesController(
      employeesService as unknown as EmployeesService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all employees', async () => {
    const employees = [{ id: 1, name: 'Test Employee' }];
    employeesService.findAll.mockResolvedValue(employees);

    await expect(controller.findAll()).resolves.toEqual(employees);
    expect(employeesService.findAll).toHaveBeenCalled();
  });

  it('should return an employee by ID', async () => {
    const employee = { id: 1, name: 'Test Employee' };
    employeesService.findOne.mockResolvedValue(employee);

    await expect(controller.findOne(1)).resolves.toEqual(employee);
    expect(employeesService.findOne).toHaveBeenCalledWith(1);
  });

  it('should return active employee status', () => {
    expect(controller.getActiveStatus(true)).toEqual({
      status: true,
      message: 'Employees are active',
    });
  });

  it('should return inactive employee status', () => {
    expect(controller.getActiveStatus(false)).toEqual({
      status: false,
      message: 'Employees are inactive',
    });
  });

  it('should return a valid UUID response', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';

    expect(controller.testUUID(uuid)).toEqual({
      message: 'Valid UUID received',
      id: uuid,
    });
  });

  it('should create an employee', async () => {
    const dto = {
      name: 'Test Employee',
      email: 'test@example.com',
      role: 'Developer',
      departmentId: 1,
    };

    const employee = { id: 1, ...dto };
    employeesService.create.mockResolvedValue(employee);

    await expect(controller.create(dto)).resolves.toEqual(employee);
    expect(employeesService.create).toHaveBeenCalledWith(dto);
  });

  it('should update an employee', async () => {
    const dto = {
      name: 'Updated Employee',
      email: 'updated@example.com',
      role: 'Senior Developer',
      departmentId: 1,
    };

    const employee = { id: 1, ...dto };
    employeesService.update.mockResolvedValue(employee);

    await expect(controller.update(1, dto)).resolves.toEqual(employee);
    expect(employeesService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should update an employee role', async () => {
    const dto = { role: 'Team Lead' };
    const employee = { id: 1, role: dto.role };

    employeesService.updateRole.mockResolvedValue(employee);

    await expect(controller.updateRole(1, dto)).resolves.toEqual(employee);
    expect(employeesService.updateRole).toHaveBeenCalledWith(
      1,
      dto.role,
    );
  });

  it('should delete an employee', async () => {
    const result = {
      message: 'Employee deleted successfully',
      employee: { id: 1, name: 'Test Employee' },
    };

    employeesService.remove.mockResolvedValue(result);

    await expect(controller.remove(1)).resolves.toEqual(result);
    expect(employeesService.remove).toHaveBeenCalledWith(1);
  });
});
