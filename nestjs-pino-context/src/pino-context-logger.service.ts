import { Injectable, LoggerService, Scope, Optional } from '@nestjs/common';
import * as createPinoLogger from 'pino';
import { get, pickBy, isEmpty, fromPairs } from 'lodash';
import { Context } from '../../nestjs-context';
import { PinoContextConfig } from './pino-context.config';
import {
  LogFieldsConfigPartContextType,
  LogFieldsConfigPartRequestType,
  LogFieldsConfigPartEnvType,
  LogFieldsConfigPartType,
  LogFieldsConfigKeyOptionType,
  LogFieldsConfigType,
} from './types';
import { LogFieldsConfigKey } from './enums';
import { hasConfiguration } from './type-guards';
import { CONTEXT_PINO_LOGGER_REQUEST } from './constants';

@Injectable({ scope: Scope.TRANSIENT })
export class PinoContextLogger implements LoggerService {
  private context: string;

  constructor(
    readonly config: PinoContextConfig,
    private readonly contextStorage: Context,
    @Optional() private logger = createPinoLogger(config.loggerOptions),
  ) {}

  setContext(context: string): void {
    this.logger = this.logger.child({ context: context });
    this.context = context;
  }

  hasContext(): boolean {
    return !!this.context;
  }

  private buildFieldsForConfigHelper(
    configKey: LogFieldsConfigKeyOptionType,
    configName: keyof LogFieldsConfigType,
    getFieldValueCallback: (
      path: string[], // a path to look for a field value
      fieldConfig: // the field configuration
      | LogFieldsConfigPartContextType
        | LogFieldsConfigPartRequestType
        | LogFieldsConfigPartEnvType,
    ) => any,
  ) {
    return fromPairs(
      (this.config[configKey][configName] as LogFieldsConfigPartType[]).map(
        fieldConfig => {
          let label: string;
          let path: string[] = [];

          if (typeof fieldConfig === 'string') {
            label = fieldConfig;
          } else {
            let pathConfig: LogFieldsConfigPartType['path'];
            ({ label, path: pathConfig = '' } = fieldConfig);
            path =
              typeof pathConfig === 'string'
                ? pathConfig.split('.').filter(s => s.length)
                : pathConfig;
          }

          // default path is label
          path = path.length ? path : [label];

          return [label, getFieldValueCallback(path, fieldConfig)];
        },
      ),
    );
  }

  private buildFieldsForContextConfig(configKey: LogFieldsConfigKeyOptionType) {
    return this.buildFieldsForConfigHelper(
      configKey,
      'context',
      (path: string[]) => {
        return get(this.contextStorage, path);
      },
    );
  }

  private buildFieldsForRequestConfig(configKey: LogFieldsConfigKeyOptionType) {
    return this.buildFieldsForConfigHelper(
      configKey,
      'request',
      (path: string[]) =>
        get(this.contextStorage, [
          CONTEXT_PINO_LOGGER_REQUEST,
          configKey,
          ...path,
        ]),
    );
  }

  private buildFieldsForEnvConfig(configKey: LogFieldsConfigKeyOptionType) {
    return this.buildFieldsForConfigHelper(
      configKey,
      'env',
      (path: string[], fieldConfig) => {
        const value = (fieldConfig as Required<LogFieldsConfigPartEnvType>)
          .value;
        return typeof value !== 'undefined' ? value : get(process.env, path);
      },
    );
  }

  // the fields will be overridden following this priority (3>2>1 priority => overrides) :
  // Priority 1 Context values
  // Priority 2 Request values
  // Priority 3 Env / Environment values
  private buildFields(configKey: LogFieldsConfigKeyOptionType) {
    if (!hasConfiguration(this.config, [configKey])) {
      return {};
    }
    return pickBy(
      {
        ...this.buildFieldsForContextConfig(configKey),
        ...this.buildFieldsForRequestConfig(configKey),
        ...this.buildFieldsForEnvConfig(configKey),
      },
      (value: any) => !isEmpty(value),
    );
  }

  /**
   * This method allows to add an env label using the logger
   * service instance
   *
   * @param label: string
   * @param value: any
   */
  setLabel(label: string, value: any) {
    const labelDef = {
      label,
      value,
    };
    if (!this.config.labels.env.includes(labelDef)) {
      this.config.labels.env.push(labelDef);
    }
    return this;
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
        ...this.buildFields(LogFieldsConfigKey.FIELDS),
        [this.config.getFieldNameContext()]: context,
        [this.config.getFieldNameTrace()]: trace,
        [this.config.getFieldNameLabels()]: this.buildFields(
          LogFieldsConfigKey.LABELS,
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
    return this.logger.debug(
      this.getMergingObject({ context }),
      message,
      ...args,
    );
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
