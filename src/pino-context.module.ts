import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ContextModule } from 'nestjs-context';

import { PinoContextLogger, SetContextExplorer } from './services';
import { ModuleRegisterType } from './types';
import { PinoContextConfig } from './pino-context.config';

@Module({})
export class PinoContextModule {
  static register(configModule: ModuleRegisterType = {}): DynamicModule {
    const config = new PinoContextConfig(configModule);
    const ConfigProvider = {
      provide: PinoContextConfig,
      useValue: config,
    };
    return {
      module: PinoContextModule,
      imports: [
        ContextModule.registerWithDefaults(config.context),
        DiscoveryModule,
      ],
      providers: [
        SetContextExplorer,
        {
          provide: PinoContextConfig,
          useValue: new PinoContextConfig({}),
        },
        PinoContextLogger,
        ConfigProvider,
      ],
      exports: [PinoContextLogger, PinoContextConfig],
    };
  }
}
