import { LoggerOptions, PrettyOptions } from 'pino';

const prettyOptions = {
  translateTime: true,
  colorize: true,
} as PrettyOptions;

const defaultOptions = {
  // Already in stackdriver ignore
  timestamp: process.env.NODE_ENV !== 'production',
  // In prod only log info
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  // Don't log hostname and pid
  base: {},
  // Tweaks to be compatible Stackdriver
  levelKey: 'severity',
  messageKey: 'message',
  useLevelLabels: true,
  // Local run, parse JSON to be human readable
  prettyPrint: process.env.NODE_ENV !== 'production' ? prettyOptions : false,
};

export class PinoLoggerConfig {
  constructor(private readonly config: LoggerOptions = {}) {
    this.config = {
      ...defaultOptions,
      ...config,
    };
  }

  get() {
    return this.config;
  }


}