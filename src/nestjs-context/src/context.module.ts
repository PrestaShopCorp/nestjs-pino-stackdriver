import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Global,
  ValueProvider,
} from '@nestjs/common';
import { Context } from './context';
import { createProvidersForDecorated } from './decorators/inject-context.decorator';
import { defaultContext } from './default.context';

@Global()
@Module({})
export class ContextModule {
  static decoratedProviders: Array<ValueProvider<Context>>;

  static register(): DynamicModule {
    ContextModule.decoratedProviders = createProvidersForDecorated();
    let exports: ModuleMetadata['exports'] = ContextModule.decoratedProviders;
    let providers: ModuleMetadata['providers'] =
      ContextModule.decoratedProviders;

    const defaultContextProvider: ValueProvider<Context> = {
      provide: Context,
      useValue: defaultContext,
    };
    providers.push(defaultContextProvider);
    exports.push(defaultContextProvider);

    return {
      global: true,
      module: ContextModule,
      providers,
      exports,
    };
  }
}
