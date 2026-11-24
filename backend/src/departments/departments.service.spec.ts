
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';

import { DepartmentsService } from './departments.service.js';
import type { Department } from './entities/department.entity.js';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  const departmentRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
  };

  const departments = [
    { id: 1, name: 'Development', employees: [] },
    { id: 2, name: 'Testing', employees: [] },
    { id: 3, name: 'DevOps', employees: [] },
  ] as Department[];

  beforeEach(() => {
    vi.clearAllMocks();

    service = new DepartmentsService(
      departmentRepository as unknown as Repository<Department>,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all departments with employees', async () => {
    departmentRepository.find.mockResolvedValue(departments);

    const result = await service.findAll();

    expect(result).toEqual(departments);
    expect(departmentRepository.find).toHaveBeenCalledWith({
      relations: { employees: true },
    });
  });

  it('should return a department by ID with employees', async () => {
    departmentRepository.findOne.mockResolvedValue(departments[0]);

    const result = await service.findOne(1);

    expect(result).toEqual(departments[0]);
    expect(departmentRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { employees: true },
    });
  });

  it('should throw NotFoundException when department does not exist', async () => {
    departmentRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(
      NotFoundException,
    );

    await expect(service.findOne(999)).rejects.toThrow(
      'Department 999 not found',
    );
  });
});
