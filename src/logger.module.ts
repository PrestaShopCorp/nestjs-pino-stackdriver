import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ContextModule } from './nestjs-context';
import { CorrelationIdModule } from './nestjs-correlation-id';
import { GcloudTraceModule } from './nestjs-gcloud-trace';
import {
  ConfigType,
  ModuleRegisterType,
  PinoContextModule,
} from './nestjs-pino-context';
import { Logger } from './logger.service';
import { stackdriverConfigTool } from './tools';

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

@Module(createModuleDef(stackdriverConfigTool({})))
export class LoggerModule {
  static forRoot(config: ConfigType = {}): DynamicModule {
    return LoggerModule.register(config);
  }
  static register(config: ConfigType = {}): DynamicModule {
    const moduleConfig = stackdriverConfigTool(config);
    return {
      module: LoggerModule,
      ...createModuleDef(moduleConfig),
    };
  }
}
