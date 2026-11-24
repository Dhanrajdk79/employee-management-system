
import {
  beforeAll,
  afterAll,
  describe,
  expect,
  it,
} from 'vitest';

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import request from 'supertest';
import type { App } from 'supertest/types.js';

import { AppModule } from '../src/app.module.js';
import { HttpExceptionFilter } from '../src/common/filters/http-exception/http-exception.filter.js';
import { LoggingInterceptor } from '../src/common/interceptors/logging/logging.interceptor.js';

describe('Employee Management API (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    // Match the production application configuration.
    app.setGlobalPrefix('api');
    app.enableCors();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return Hello World', async () => {
    await request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });

  it('should reject protected endpoints without JWT', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/profile')
      .expect(401);

    await request(app.getHttpServer())
      .get('/api/employees')
      .expect(401);

    await request(app.getHttpServer())
      .get('/api/departments')
      .expect(401);
  });

  it('should register, login, and authenticate a user', async () => {
    const email = `e2e-${Date.now()}@example.com`;

    // Register a test user.
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'E2E Test User',
        email,
        password: 'Password123!',
      })
      .expect(201);

    expect(registerResponse.body.user.email).toBe(email);

    // Confirm the password is not returned.
    expect(registerResponse.body.user.password).toBeUndefined();

    // Login and obtain JWT.
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email,
        password: 'Password123!',
      })
      .expect(200);

    accessToken = loginResponse.body.access_token;

    expect(accessToken).toBeDefined();

    // Access protected profile.
    const profileResponse = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(profileResponse.body.user.email).toBe(email);
  });

  it('should allow authenticated access to employees and departments', async () => {
    expect(accessToken).toBeDefined();

    // Get employees.
    const employeeResponse = await request(app.getHttpServer())
      .get('/api/employees')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(employeeResponse.body).toBeDefined();

    // Get departments.
    const departmentResponse = await request(app.getHttpServer())
      .get('/api/departments')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(departmentResponse.body).toBeDefined();
  });
});
