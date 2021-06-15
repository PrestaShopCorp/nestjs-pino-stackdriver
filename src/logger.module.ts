import { pick } from 'lodash';
import { DynamicModule, Module } from '@nestjs/common';
import { LoggerConfigType, ModuleRegisterType } from './types';
import { PinoContextLoggerModule } from './pino-context-logger.module';
import { createStackdriverLoggerConfig } from './tools';

const createModuleDef = (config?: ModuleRegisterType) => {
  return pick(PinoContextLoggerModule.register(config), [
    'imports',
    'providers',
    'exports',
  ]);
};

@Module(createModuleDef(createStackdriverLoggerConfig({})))
export class LoggerModule {
  static forRoot(config: LoggerConfigType = {}): DynamicModule {
    return LoggerModule.register(config);
  }
  static register(config: LoggerConfigType = {}): DynamicModule {
    const moduleConfig = createStackdriverLoggerConfig(config);
    return {
      ...createModuleDef(moduleConfig),
      module: LoggerModule,
    };
  }
}
