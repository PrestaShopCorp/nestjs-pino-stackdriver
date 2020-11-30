let __correlationIdContext = 'loading...';

export const CorrelationId = () => (target: any, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    configurable: false,
    enumerable: true,
    get(): any {
      return __correlationIdContext;
    },
    set: undefined,
  });
};

export const setCorrelationIdContext = (correlationId: string) => {
  __correlationIdContext = correlationId;
};
