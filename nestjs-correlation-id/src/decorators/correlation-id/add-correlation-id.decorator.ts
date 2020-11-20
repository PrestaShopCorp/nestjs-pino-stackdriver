import { InternalServerErrorException } from '@nestjs/common';
import { cloneDeep, set } from 'lodash';
import decoratorsContextTool from '../../tools/decorators-context.tool';

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
      this[dataPropertyName] = cloneDeep(this[accessorPropertyName]);
    }

    get [accessorPropertyName]() {
      if (correlationIdPathParts.length === 0) {
        return decoratorsContextTool.getCorrelationId();
      }
      return set(
        this[dataPropertyName],
        correlationIdPathParts,
        decoratorsContextTool.getCorrelationId(),
      );
    }

    set [accessorPropertyName](value: any) {
      this[dataPropertyName] = value;
    }
  };
  Object.defineProperty(newClass, 'name', {
    value: Target.name,
  });
  return newClass;
};
