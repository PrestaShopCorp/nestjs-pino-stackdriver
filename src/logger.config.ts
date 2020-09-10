import { v4 as uuidv4 } from 'uuid';
import { pick } from 'lodash';
import { LoggerOptions, PrettyOptions } from 'pino';
import { Options } from 'pino-http';
import { HeaderNameInterface } from './header-name.interface';

const prettyOptions = {
  translateTime: true,
  colorize: true,
} as PrettyOptions;

export const loggerConfig = (
  pinoOptions: LoggerOptions = {},
  headerNameMapping: HeaderNameInterface = {correlationId: 'x-correlation-id'}
) => {

  const config = {
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
    ...pinoOptions,

    // pino-http options
    // request id
    genReqId: function(req) {
      return (
        req.headers[headerNameMapping.correlationId] || uuidv4()
      );
    },
  } as Options

  // add serializers and rename request to labels if we are in prod
  if (process.env.NODE_ENV === 'production') {
    config.serializers = {
      req: req => pick(req.headers, Object.values(headerNameMapping)),
      res: () => {},
    };
    config.customAttributeKeys = {
      req: 'labels',
    };
  }

  return config;
}
