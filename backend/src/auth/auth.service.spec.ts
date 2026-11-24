
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service.js';
import type { UsersService } from '../users/users.service.js';
import type { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    create: vi.fn(),
    findByEmail: vi.fn(),
  };

  const jwtService = {
    signAsync: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
    };

    const user = {
      id: 1,
      name: dto.name,
      email: dto.email,
      role: 'employee',
    };

    usersService.create.mockResolvedValue(user);

    const result = await service.register(dto);

    expect(usersService.create).toHaveBeenCalledWith(
      dto.name,
      dto.email,
      dto.password,
    );

    expect(result).toEqual({
      message: 'User registered successfully',
      user,
    });
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'Password123',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('should reject an incorrect password', async () => {
    const hashedPassword = await bcrypt.hash('CorrectPassword123', 4);

    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      role: 'employee',
    });

    await expect(
      service.login({
        email: 'test@example.com',
        password: 'WrongPassword123',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('should login successfully and generate a JWT', async () => {
    const hashedPassword = await bcrypt.hash('Password123', 4);

    usersService.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      role: 'employee',
    });

    jwtService.signAsync.mockResolvedValue('test-jwt-token');

    const result = await service.login({
      email: 'test@example.com',
      password: 'Password123',
    });

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'test@example.com',
      role: 'employee',
    });

    expect(result).toEqual({
      message: 'Login successful',
      access_token: 'test-jwt-token',
    });
  });
});
