import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { PinoContextModule } from './pino-context.module';
import { Logger } from './logger.service';
import { CorrelationIdModule } from '../../nestjs-correlation-id/src';
import { GcloudTraceModule } from '../../nestjs-gcloud-trace/src';
import { ContextModule } from '../../nestjs-context/src';
import { ConfigType, ModuleRegisterType } from './types';
import { PredefinedConfig } from './enums';

const createModuleDef = (config?: ModuleRegisterType) => {
  const pinoContextModule = PinoContextModule.register(config);
  return {
    imports: [DiscoveryModule, ContextModule.register(), CorrelationIdModule.register(), GcloudTraceModule],
    providers: [...(pinoContextModule.providers as Provider[]), Logger],
    exports: [...(pinoContextModule.exports as Provider[]), Logger],
  };
};

@Module(createModuleDef())
export class LoggerModule {
  static forRoot(config: ConfigType = {}): DynamicModule {
    const moduleConfig = isEmpty(config) ? PredefinedConfig.STACKDRIVER : {
      ...config,
      base: PredefinedConfig.STACKDRIVER
    };
    return {
      module: LoggerModule,
      ...createModuleDef(moduleConfig)
    };
  }
  static register(config: ConfigType = {}): DynamicModule {
    const moduleConfig = isEmpty(config) ? PredefinedConfig.STACKDRIVER : {
      ...config,
      base: PredefinedConfig.STACKDRIVER
    };
    return {
      module: LoggerModule,
      ...createModuleDef(moduleConfig)
    };
  }
}
