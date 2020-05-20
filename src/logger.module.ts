import { Global, Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { PinoLoggerConfig } from './logger.config';
import { LoggerOptions } from 'pino';

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {
  static forRoot(config?: LoggerOptions) {
    const configProvider = {
      provide: PinoLoggerConfig,
      useValue: new PinoLoggerConfig(config),
    };
    return {
      module: LoggerModule,
      providers: [Logger, configProvider],
      exports: [Logger, configProvider],
    };
  }
}
