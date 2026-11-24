
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const apiKey = request.headers['x-api-key'];

    if (apiKey !== 'my-secret-key') {
      throw new UnauthorizedException(
        'Invalid or missing API key',
      );
    }

    const role = request.headers['x-user-role'];

    const allowedRoles = [
      'admin',
      'project_manager',
      'employee',
      'client',
    ];

    if (
      typeof role !== 'string' ||
      !allowedRoles.includes(role)
    ) {
      throw new UnauthorizedException(
        'Valid user role is required',
      );
    }

    request.user = { role };

    return true;
  }
}
