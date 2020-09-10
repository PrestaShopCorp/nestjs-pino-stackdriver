import { v4 as uuidv4 } from 'uuid';
import { pick } from 'lodash';
import { Options } from 'pino-http';
import { HeaderNameInterface } from './header-name.interface';
import { pinoConfig } from './pino.config';

export const pinoHttpConfig = (
  headerNameMapping: HeaderNameInterface = {correlationId: 'x-correlation-id'}
) => {

  const config = {
    ...pinoConfig,

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
