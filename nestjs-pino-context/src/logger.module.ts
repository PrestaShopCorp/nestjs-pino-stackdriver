import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ContextModule } from '../../nestjs-context';
import { PinoContextModule } from './pino-context.module';
import { ModuleRegisterType } from './types';
import { Logger } from './logger.service';

/** @Deprecated **/
@Module({
  imports: [DiscoveryModule, ContextModule.register()],
})
export class LoggerModule extends PinoContextModule {
  static register(configModule?: ModuleRegisterType): DynamicModule {
    const superRegister = super.register(configModule);
    return {
      module: LoggerModule,
      providers: [...(superRegister.providers as Provider[]), Logger],
      exports: [...(superRegister.exports as Provider[]), Logger],
    };
  }
}
