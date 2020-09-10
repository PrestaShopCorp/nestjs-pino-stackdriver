import { Injectable, LoggerService } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class Logger implements LoggerService {
  constructor(private readonly logger: PinoLogger) {}

  setContext(context: string): void {
    this.logger.setContext(context);
  }

  verbose(message: any, context?: string, ...args: any[]) {
    return context
      ? this.logger.trace(
          { context },
          message,
          ...args,
        )
      : this.logger.trace(message, ...args);
  }

  debug(message: any, context?: string, ...args: any[]) {
    return context
      ? this.logger.debug(
          { context },
          message,
          ...args,
        )
      : this.logger.debug(message, ...args);
  }

  log(message: any, context?: string, ...args: any[]) {
    return context
      ? this.logger.info({ context }, message, ...args)
      : this.logger.info(message, ...args);
  }

  warn(message: any, context?: string, ...args: any[]) {
    return context
      ? this.logger.warn({ context }, message, ...args)
      : this.logger.warn(message, ...args);
  }

  error(message: any, trace?: string, context?: string, ...args: any[]) {
    if (context) {
      this.logger.error({ context, trace }, message, ...args);
    } else if (trace) {
      this.logger.error({ trace }, message, ...args);
    } else {
      this.logger.error(message, ...args);
    }
  }

  // TODO Vincent : is this still necessary ?
  clone(): Logger {
    const copy = new (this.constructor as { new (): Logger })();
    Object.assign(copy, this);
    return copy;
  }
}
