import { v4 } from 'uuid';
import { Injectable, LoggerService, Scope, Optional } from '@nestjs/common';
import { pickBy, isEmpty } from 'lodash';
import { Context, RequestType } from 'nestjs-context';
import { LoggerConfig } from '../config';
import pino from "pino";

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements LoggerService {
  private context: string;
  private customLabels: Record<string, any>;
  private _autoResetCustomLabels: boolean;

  constructor(
    @Optional()
    private readonly config: LoggerConfig = new LoggerConfig(),
    @Optional()
    private readonly appContext: Context = new Context(
      `Logger-${v4()}`,
      config.context,
      {} as RequestType,
    ),
    @Optional() private logger = pino(config.loggerOptions),
  ) {
    this.customLabels = {};
    this.autoResetCustomLabels = false;
  }

  set autoResetCustomLabels(value: boolean) {
    this._autoResetCustomLabels = value;
  }

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
    const returned = pickBy(
      {
        [this.config.getFieldNameContext()]: context ?? this.context,
        [this.config.getFieldNameTrace()]: trace,
        [this.config.getFieldNameLabels()]: {
          ...this.appContext.createView(this.config.labels),
          ...this.customLabels,
        },
      },
      (value: any) => !isEmpty(value),
    );
    if (this._autoResetCustomLabels) {
      this.clearLabels();
    }
    return returned;
  }

  setLabel(key: string, value: any) {
    this.customLabels[key] = value;
  }

  clearLabels() {
    this.customLabels = {};
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
