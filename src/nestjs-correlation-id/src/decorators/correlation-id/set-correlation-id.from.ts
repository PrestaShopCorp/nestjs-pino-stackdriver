import { get } from 'lodash';
import { defaultContext } from '../../../../nestjs-context/src';
import { CONTEXT_CORRELATION_ID } from '../../constants';

export const SetCorrelationIdFrom = (path = '', index = 0) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const argWithValue = args[index];
    const value = path !== '' ? get(argWithValue, path) : argWithValue;
    defaultContext.set(CONTEXT_CORRELATION_ID, value);
    return originalMethod.apply(this, args);
  };
};
