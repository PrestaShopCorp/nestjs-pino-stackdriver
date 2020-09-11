import { v4 as uuidv4 } from 'uuid';
import { pickBy } from 'lodash';
import { Options } from 'pino-http';
import { CorrelationTracerHeadersInterface } from './correlation-tracer-headers.interface';
import { pinoConfig } from './pino.config';

export const pinoHttpConfig = (
  headerNameMapping: CorrelationTracerHeadersInterface = {
    correlationId: 'x-correlation-id',
    gcloudTrace: 'logging.googleapis.com/trace',
  }
) => {

  const config = {
    ...pinoConfig,

    // request id
    genReqId: req =>
        headerNameMapping.correlationId && req.headers[headerNameMapping.correlationId]
          ? req.headers[headerNameMapping.correlationId]
          : uuidv4()
    ,
  } as Options

  // add serializers and rename request to labels if we are in prod
  if (process.env.NODE_ENV === 'production') {
    const headerNames = Object.values(headerNameMapping);
    config.serializers = {
      req: req => pickBy(req.headers,(value: any, key: string) => headerNames.includes(key) && !!value),
      res: () => {},
    };
    config.customAttributeKeys = {
      req: 'labels',
    };
  }

  return config;
}
