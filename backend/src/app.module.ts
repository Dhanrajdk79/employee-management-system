
import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { EmployeesModule } from './employees/employees.module.js';
import { EmployeesController } from './employees/employees.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { DepartmentsModule } from './departments/departments.module.js';

import { LoggerMiddleware } from './common/middleware/logger/logger.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT') ?? 3306),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AuthModule,
    DepartmentsModule,
    EmployeesModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(EmployeesController);
  }
}
