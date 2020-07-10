import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { isObject, isString } from '@nestjs/common/utils/shared.utils';
import * as pino from 'pino';
import { PinoLoggerConfig } from './logger.config';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private pino: pino.Logger;
  private readonly options: any;

  constructor(options: PinoLoggerConfig = new PinoLoggerConfig()) {
    this.options = options.get();
    this.pino = pino(this.options);
  }

  setContext(context: string) {
    this.pino = pino(this.options).child({ context });
  }

  setLabels(context: object) {
    this.pino = this.pino.child({ ...context });
  }

  info(msg: any, context?: string, ...args: any[]) {
    if (context) {
      this.pino.child({ context }).infoq(msg, ...args);
      return;
    }
    this.pino.info(msg, ...args);
  }

  log(msg: any, context?: string, ...args: any[]) {
    if (context) {
      this.pino.child({ context }).info(msg, ...args);
      return;
    }
    this.pino.info(msg, ...args);
  }

  error(msg: any, trace?: string, context?: string, ...args: any[]) {
    this.pino.error(
      {
        message: isString(msg) ? msg : 'Error',
        ...(isObject(msg) ? msg : {}),
        trace,
      },
      ...args,
    );
  }

  warn(msg: any, context?: string, ...args: any[]) {
    if (context) {
      this.pino.child({ context }).warn(msg, ...args);
      return;
    }
    this.pino.warn(msg, ...args);
  }

  debug(msg: any, context?: string, ...args: any[]) {
    if (context) {
      this.pino.child({ context }).debug(msg, ...args);
      return;
    }
    this.pino.debug(msg, context, ...args);
  }

  verbose(msg: any, context?: string, ...args: any[]) {
    if (context) {
      this.pino.child({ context }).verbose(msg, ...args);
      return;
    }
    this.pino.verbose(msg, context, ...args);
  }

  clone(): Logger {
    const copy = new (this.constructor as { new (): Logger })();
    Object.assign(copy, this);
    return copy;
  }
}
