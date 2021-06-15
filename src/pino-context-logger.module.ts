import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { Logger, SetContextExplorer } from './services';
import { ModuleRegisterType } from './types';
import { LoggerConfig } from './config';

@Module({})
export class PinoContextLoggerModule {
  static register(configModule: ModuleRegisterType = {}): DynamicModule {
    const config = new LoggerConfig(configModule);
    const ConfigProvider = {
      provide: LoggerConfig,
      useValue: config,
    };
    return {
      module: PinoContextLoggerModule,
      imports: [DiscoveryModule],
      providers: [
        SetContextExplorer,
        {
          provide: LoggerConfig,
          useValue: new LoggerConfig({}),
        },
        Logger,
        ConfigProvider,
      ],
      exports: [Logger, LoggerConfig],
    };
  }
}
