import type { Logger as WinstonLogger } from 'winston';

declare global {
  namespace Express {
    interface Request {
      logger: WinstonLogger;
    }
  }
}
