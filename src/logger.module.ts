import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigType, ModuleRegisterType } from './types';
import { Logger } from './services';
import { PinoContextModule } from './pino-context.module';
import { createStackdriverLoggerConfig } from './tools';

const createModuleDef = (config?: ModuleRegisterType) => {
  const pinoContextModule = PinoContextModule.register(config);
  return {
    imports: [DiscoveryModule],
    providers: [...(pinoContextModule.providers as Provider[]), Logger],
    exports: [...(pinoContextModule.exports as Provider[]), Logger],
  };
};

@Module(createModuleDef(createStackdriverLoggerConfig({})))
export class LoggerModule {
  static forRoot(config: ConfigType = {}): DynamicModule {
    return LoggerModule.register(config);
  }
  static register(config: ConfigType = {}): DynamicModule {
    const moduleConfig = createStackdriverLoggerConfig(config);
    return {
      module: LoggerModule,
      ...createModuleDef(moduleConfig),
    };
  }
}
