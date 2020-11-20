import decoratorsContextTool from '../../tools/decorators-context.tool';

export const CorrelationId = () => (target: any, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      return decoratorsContextTool.getCorrelationId();
    },
    set: undefined,
  });
};
