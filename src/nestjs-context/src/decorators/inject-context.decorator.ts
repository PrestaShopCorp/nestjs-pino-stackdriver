import { Inject, ValueProvider } from '@nestjs/common';
import { Context, createContext } from '../context';

const __nestjsPinoStackdriverContexts = new Map<string, Symbol>();

export const InjectContext = (contextName: string) => {
  let symbol = __nestjsPinoStackdriverContexts.get(contextName);
  if (!symbol) {
    symbol = Symbol(contextName);
    __nestjsPinoStackdriverContexts.set(contextName, symbol);
  }
  return Inject(symbol);
};

export function createProvidersForDecorated(): Array<ValueProvider<Context>> {
  return [...__nestjsPinoStackdriverContexts].map(
    ([contextName, symbol]) =>
      ({
        provide: symbol,
        useValue: createContext(),
      } as ValueProvider<Context>),
  );
}
