import { defaultContext } from '../../../../nestjs-context/src';
import { CONTEXT_CORRELATION_ID } from '../../constants';

export const CorrelationId = () => (target: any, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      return defaultContext.get(CONTEXT_CORRELATION_ID);
    },
    set: undefined,
  });
};
