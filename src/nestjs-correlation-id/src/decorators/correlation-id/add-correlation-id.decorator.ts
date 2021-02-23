import { InternalServerErrorException } from '@nestjs/common';
import { cloneDeep, set } from 'lodash';
import { defaultContext } from '../../../../nestjs-context/src';
import { CONTEXT_CORRELATION_ID } from '../../constants';

/**
 * Class Decorator that will set the current context
 * correlation id into a given property path of a class
 *
 * @param correlationIdPath
 * @constructor
 */
export const AddCorrelationId = (correlationIdPath: string) => <
  T extends { new (...args: any[]): any }
>(
  Target: T,
) => {
  if (!correlationIdPath.length) {
    throw new InternalServerErrorException(
      'Correlation id path must have at least 1 character',
    );
  }
  const correlationIdPathParts = correlationIdPath.split('.');
  const accessorPropertyName = correlationIdPathParts.shift() as NonNullable<
    string
  >;
  const dataPropertyName = `__add-correlation-id-${accessorPropertyName}`;

  const newClass = class extends Target {
    constructor(...args: any[]) {
      super(...args);
      const descriptor = cloneDeep(this[accessorPropertyName]);
      Object.defineProperty(this, dataPropertyName, {
        enumerable: false,
        value: descriptor,
      });
      Object.defineProperty(this, accessorPropertyName, {
        enumerable: true,
        get() {
          if (correlationIdPathParts.length === 0) {
            return defaultContext.get(CONTEXT_CORRELATION_ID);
          }
          return set(
            this[dataPropertyName],
            correlationIdPathParts,
            defaultContext.get(CONTEXT_CORRELATION_ID),
          );
        },
        set(value: any) {
          this[dataPropertyName] = value;
        },
      });
    }
  };
  Object.defineProperty(newClass, 'name', {
    value: Target.name,
  });

  return newClass;
};
