import { Module } from '@nestjs/common';
import { LoggerOptions } from 'pino';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import { HeaderNameInterface } from './header-name.interface';
import { Logger } from './logger.service';
import { loggerConfig } from './logger.config';

@Module({})
export class LoggerModule {
  static forRoot(config?: LoggerOptions, headerNames?: HeaderNameInterface) {
    const pinoHttp = loggerConfig(config, headerNames);
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp,
        } as Params),
      ],
      providers: [Logger],
      exports: [Logger],
    };
  }
}
