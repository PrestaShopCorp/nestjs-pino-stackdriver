import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule, APP_INTERCEPTOR } from '@nestjs/core';
import { ContextModule } from '../../nestjs-context';

import { PinoContextLogger } from './pino-context-logger.service';
import { ConfigType, ModuleRegisterType } from './types';
import { PinoContextRequestInterceptor } from './pino-context-request.interceptor';
import { PinoContextConfig } from './pino-context.config';
import { SetContextForLoggerInstancesExplorer } from './set-context-for-logger-instances.explorer';

@Module({
  imports: [DiscoveryModule, ContextModule.register()],
})
export class PinoContextModule {
  static forRoot(config?: ModuleRegisterType): DynamicModule {
    return PinoContextModule.register(config);
  }

  static register(configModule?: ModuleRegisterType): DynamicModule {
    const config = new PinoContextConfig(configModule);

    const ConfigProvider: Provider<ConfigType> = {
      provide: PinoContextConfig,
      useValue: config,
    };

    return {
      module: PinoContextModule,
      providers: [
        SetContextForLoggerInstancesExplorer,
        ConfigProvider,
        PinoContextLogger,
        {
          provide: APP_INTERCEPTOR,
          useClass: PinoContextRequestInterceptor,
        },
      ],
      exports: [PinoContextLogger],
    };
  }
}
