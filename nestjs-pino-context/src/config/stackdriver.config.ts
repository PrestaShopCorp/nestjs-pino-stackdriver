import { LoggerOptions, PrettyOptions } from 'pino';
import { LogFieldsConfigPartContextType } from '../types';
import { LogFieldsConfigKey } from '../enums';

/**
 * @todo check if it's interesting to trace correlation-id logs in the same
 *    operation: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogEntryOperation
 * @todo fix warnings when using levelKey, messageKey and useLevelLabels
 * @see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
 * */

const prettyOptions = {
  translateTime: true,
  colorize: true,
} as PrettyOptions;

export const loggerOptions = {
  // Already in stackdriver ignore
  timestamp: process.env.NODE_ENV !== 'production',
  // In prod only log info
  level: process.env.NODE_ENV !== 'production' ? 'trace' : 'info',
  // Don't log hostname and pid
  base: {},
  // Tweaks to be compatible Stackdriver
  levelKey: 'severity',
  messageKey: 'message',
  useLevelLabels: true,
  // Local run, parse JSON to be human readable
  prettyPrint: process.env.NODE_ENV !== 'production' ? prettyOptions : false,
} as LoggerOptions;

export const stackdriver = {
  // if any of correlation-id or gcloud-trace modules are includes,
  // their label and field will automatically be added
  [LogFieldsConfigKey.FIELDS]: {
    context: [
      'logging.googleapis.com/trace',
    ] as LogFieldsConfigPartContextType[],
  },
  [LogFieldsConfigKey.LABELS]: {
    context: ['x-correlation-id'] as LogFieldsConfigPartContextType[],
  },
  logFieldNames: {
    context: 'context',
    labels: 'labels',
    trace: 'trace',
  },
  loggerOptions,
};
