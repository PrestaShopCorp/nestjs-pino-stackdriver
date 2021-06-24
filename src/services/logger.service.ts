import { Injectable, LoggerService, Scope, Optional } from '@nestjs/common';
import * as createPinoLogger from 'pino';
import { pickBy, isEmpty } from 'lodash';
import { Context } from 'nestjs-context';
import { LoggerConfig } from '../config';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private context: string;

  constructor(
    @Optional()
    private readonly config: LoggerConfig = new LoggerConfig(),
    @Optional()
    private readonly executionContext: Context = new Context(config.context),
    @Optional() private logger = createPinoLogger(config.loggerOptions),
  ) {}

  setContext(context: string): void {
    // this.logger = this.logger.child({ context: context });
    this.context = context;
  }

  hasContext(): boolean {
    return !!this.context;
  }

  private getMergingObject({
    context,
    trace,
  }: {
    context?: string;
    trace?: string;
  }) {
    return pickBy(
      {
        [this.config.getFieldNameContext()]: context ?? this.context,
        [this.config.getFieldNameTrace()]: trace,
        [this.config.getFieldNameLabels()]: this.executionContext.createView(
          this.config.labels,
        ),
      },
      (value: any) => !isEmpty(value),
    );
  }

  verbose(message: any, context?: string, ...args: any[]) {
    return this.logger.trace(
      this.getMergingObject({ context }),
      message,
      ...args,
    );
  }

  debug(message: any, context?: string, ...args: any[]) {
    const merge = this.getMergingObject({ context });
    return this.logger.debug(merge, message, ...args);
  }

  log(message: any, context?: string, ...args: any[]) {
    return this.logger.info(
      this.getMergingObject({ context }),
      message,
      ...args,
    );
  }

  warn(message: any, context?: string, ...args: any[]) {
    return this.logger.warn(
      this.getMergingObject({ context }),
      message,
      ...args,
    );
  }

  error(message: any, trace?: string, context?: string, ...args: any[]) {
    if (message instanceof Error) {
      message = message.message;
      trace = trace || message.stack;
    }
    return this.logger.error(
      this.getMergingObject({ trace, context }),
      message,
      ...args,
    );
  }
}
