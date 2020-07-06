import { Global, Module, Logger } from '@nestjs/common';
import { Logger as PinoLogger } from './logger.service';
import { PinoLoggerConfig } from './logger.config';
import { LoggerOptions } from 'pino';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useValue: new PinoLogger(),
    },
  ],
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
      providers: [
        configProvider,
        {
          provide: Logger,
          useValue: new PinoLogger(new PinoLoggerConfig(config)),
        },
      ],
      exports: [Logger],
    };
  }
}
