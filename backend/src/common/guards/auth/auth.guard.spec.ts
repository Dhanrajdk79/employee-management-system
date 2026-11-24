
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard.js';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard();
  });

  function createContext(headers: Record<string, string>) {
    const request: {
      headers: Record<string, string>;
      user?: { role: string };
    } = { headers };

    const context = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue(request),
      }),
    };

    return {
      context: context as unknown as ExecutionContext,
      request,
    };
  }

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow a valid API key and admin role', () => {
    const { context, request } = createContext({
      'x-api-key': 'my-secret-key',
      'x-user-role': 'admin',
    });

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toEqual({ role: 'admin' });
  });

  it('should allow a valid employee role', () => {
    const { context, request } = createContext({
      'x-api-key': 'my-secret-key',
      'x-user-role': 'employee',
    });

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toEqual({ role: 'employee' });
  });

  it('should reject an invalid API key', () => {
    const { context } = createContext({
      'x-api-key': 'wrong-key',
      'x-user-role': 'admin',
    });

    expect(() => guard.canActivate(context)).toThrow(
      UnauthorizedException,
    );
  });

  it('should reject a missing API key', () => {
    const { context } = createContext({
      'x-user-role': 'admin',
    });

    expect(() => guard.canActivate(context)).toThrow(
      'Invalid or missing API key',
    );
  });

  it('should reject an invalid role', () => {
    const { context } = createContext({
      'x-api-key': 'my-secret-key',
      'x-user-role': 'superuser',
    });

    expect(() => guard.canActivate(context)).toThrow(
      'Valid user role is required',
    );
  });

  it('should reject a missing role', () => {
    const { context } = createContext({
      'x-api-key': 'my-secret-key',
    });

    expect(() => guard.canActivate(context)).toThrow(
      'Valid user role is required',
    );
  });
});
