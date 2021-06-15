import { LoggerOptions, PrettyOptions } from 'pino';
import { LoggerConfigType } from '../../types';
import { loggerContextConfig } from '../logger-context.config';

/**
 * @todo check if it's interesting to trace correlation-id logs in the same
 *    operation: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogEntryOperation
 * */

const prettyOptions = {
  translateTime: true,
  colorize: true,
} as PrettyOptions;

const loggerOptions = {
  // Already in stackdriver ignore
  timestamp: process.env.NODE_ENV !== 'production',
  // In prod only log info
  level: process.env.NODE_ENV !== 'production' ? 'trace' : 'info',
  // Don't log hostname and pid
  base: {},
  // Tweaks to be compatible Stackdriver
  messageKey: 'message',
  formatters: {
    level: () => {
      return { level: 'severity' };
    },
  },

  // Local run, parse JSON to be human readable
  prettyPrint: process.env.NODE_ENV !== 'production' ? prettyOptions : false,
} as LoggerOptions;

export const stackdriver = {
  logFieldNames: {
    context: 'context',
    labels: 'labels',
    trace: 'trace',
  },
  loggerOptions,
  context: loggerContextConfig,
} as LoggerConfigType;
