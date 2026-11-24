
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DepartmentsController } from './departments.controller.js';
import type { DepartmentsService } from './departments.service.js';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;

  const departmentsService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new DepartmentsController(
      departmentsService as unknown as DepartmentsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all departments', async () => {
    const departments = [
      { id: 1, name: 'Development', employees: [] },
      { id: 2, name: 'Testing', employees: [] },
    ];

    departmentsService.findAll.mockResolvedValue(departments);

    await expect(controller.findAll()).resolves.toEqual(departments);
    expect(departmentsService.findAll).toHaveBeenCalled();
  });

  it('should return a department by ID', async () => {
    const department = {
      id: 1,
      name: 'Development',
      employees: [],
    };

    departmentsService.findOne.mockResolvedValue(department);

    await expect(controller.findOne(1)).resolves.toEqual(department);
    expect(departmentsService.findOne).toHaveBeenCalledWith(1);
  });
});
