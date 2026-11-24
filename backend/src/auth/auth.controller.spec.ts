
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import type { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    register: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new AuthController(
      authService as unknown as AuthService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const dto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
    };

    const result = {
      message: 'User registered successfully',
      user: { id: 1, email: dto.email },
    };

    authService.register.mockResolvedValue(result);

    await expect(controller.register(dto)).resolves.toEqual(result);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'Password123',
    };

    const result = {
      message: 'Login successful',
      access_token: 'test-jwt-token',
    };

    authService.login.mockResolvedValue(result);

    await expect(controller.login(dto)).resolves.toEqual(result);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('should return the authenticated user profile', () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      role: 'employee',
    };

    expect(controller.getProfile(user)).toEqual({
      message: 'Authenticated successfully',
      user,
    });
  });
});
