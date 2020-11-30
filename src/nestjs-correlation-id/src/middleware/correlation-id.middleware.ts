import { kebabCase } from 'lodash';
import { Context } from '../../../nestjs-context';
import { CONTEXT_CORRELATION_ID } from '../constants';
import { CorrelationIdConfig } from '../correlation-id.config';
import { setCorrelationIdContext } from '../decorators/correlation-id/correlation-id.decorator';
import { setAddCorrelationIdContext } from '../decorators/correlation-id/add-correlation-id.decorator';

type RequestType = {
  header: (key: string) => any;
  headers: Record<string, any>;
} & any;
type ResponseType = {
  set: (key: string, value: any) => void;
} & any;
type NextType = () => void;

type MiddlewareFxType = (
  req: RequestType,
  res: ResponseType,
  next: NextType,
) => void | Promise<void>;

export const correlationIdMiddleware: (
  config: CorrelationIdConfig,
  context?: Context,
) => MiddlewareFxType = (config: CorrelationIdConfig, context?: Context) => {
  const { headerName, idGenerator } = config.get();

  return async (req: RequestType, res: ResponseType, next: NextType) => {
    // make sure header is kebab-cased, otherwise downstream stuff will barf.
    const header = kebabCase(headerName);
    const correlationId = (req.header(header) || idGenerator()) as string;

    // set headers in req and res
    req.headers[header] = correlationId;
    res.set(header, correlationId);

    // save correlation id in context
    if (context) {
      context.set(CONTEXT_CORRELATION_ID, correlationId);
      setCorrelationIdContext(correlationId);
      setAddCorrelationIdContext(correlationId);
    }

    next();
  };
};
