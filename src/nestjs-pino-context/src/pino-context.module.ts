import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule, APP_INTERCEPTOR } from '@nestjs/core';
import { ContextModule } from '../../nestjs-context';

import { PinoContextLogger } from './pino-context-logger.service';
import { ModuleRegisterType } from './types';
import { PinoContextRequestInterceptor } from './pino-context-request.interceptor';
import { PinoContextConfig } from './pino-context.config';
import { SetContextForLoggerInstancesExplorer } from './set-context-for-logger-instances.explorer';

const moduleDef = {
  imports: [DiscoveryModule, ContextModule.register()],
  providers: [
    SetContextForLoggerInstancesExplorer,
    {
      provide: PinoContextConfig,
      useValue: new PinoContextConfig({}),
    },
    PinoContextLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: PinoContextRequestInterceptor,
    },
  ],
  exports: [PinoContextLogger, PinoContextConfig],
};

@Module(moduleDef)
export class PinoContextModule {
  static register(configModule: ModuleRegisterType = {}): DynamicModule {
    const config = new PinoContextConfig(configModule);
    const ConfigProvider = {
      provide: PinoContextConfig,
      useValue: config,
    };
    return {
      module: PinoContextModule,
      ...moduleDef,
      providers: [...moduleDef.providers, ConfigProvider],
    };
  }
}
