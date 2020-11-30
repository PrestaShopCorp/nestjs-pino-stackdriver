import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { ContextModule } from './nestjs-context';
import { CorrelationIdModule } from './nestjs-correlation-id';
import { GcloudTraceModule } from './nestjs-gcloud-trace';
import {
  ConfigType,
  ModuleRegisterType,
  PinoContextModule,
  PredefinedConfig,
} from './nestjs-pino-context';
import { Logger } from './logger.service';

const createModuleDef = (config?: ModuleRegisterType) => {
  const pinoContextModule = PinoContextModule.register(config);
  return {
    imports: [
      DiscoveryModule,
      ContextModule.register(),
      CorrelationIdModule.register(),
      GcloudTraceModule,
    ],
    providers: [...(pinoContextModule.providers as Provider[]), Logger],
    exports: [...(pinoContextModule.exports as Provider[]), Logger],
  };
};

@Module(createModuleDef())
export class LoggerModule {
  static forRoot(config: ConfigType = {}): DynamicModule {
    const moduleConfig = isEmpty(config)
      ? PredefinedConfig.STACKDRIVER
      : {
          ...config,
          base: PredefinedConfig.STACKDRIVER,
        };
    return {
      module: LoggerModule,
      ...createModuleDef(moduleConfig),
    };
  }
  static register(config: ConfigType = {}): DynamicModule {
    const moduleConfig = isEmpty(config)
      ? PredefinedConfig.STACKDRIVER
      : {
          ...config,
          base: PredefinedConfig.STACKDRIVER,
        };
    return {
      module: LoggerModule,
      ...createModuleDef(moduleConfig),
    };
  }
}
