
import {
  Injectable,
  NestMiddleware,
  Logger,
} from '@nestjs/common';

import type {
  Request,
  Response,
  NextFunction,
} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  private readonly logger = new Logger(
    LoggerMiddleware.name,
  );

  use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
