
import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
} from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module.js';

import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Employee Management API')
    .setDescription(
      'API documentation for Employee Management System',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
      'bearer',
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(
    'docs',
    app,
    documentFactory,
    {
      useGlobalPrefix: true,
    },
  );

  await app.listen(process.env.PORT ?? 3000);

  console.log('Employee Management API is running');
  console.log('Swagger: http://localhost:3000/api/docs');
}

bootstrap();
