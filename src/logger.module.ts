import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import { CorrelationTracerHeadersInterface } from './correlation-tracer-headers.interface';
import { Logger } from './logger.service';
import { pinoHttpConfig } from './pino-http.config';

@Module({})
export class LoggerModule {
  static forRoot(config: Params = {}, headerNames?: CorrelationTracerHeadersInterface) {
    const pinoHttp = { ...pinoHttpConfig(headerNames), ...(config.pinoHttp || {}) };
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          ...config,
          pinoHttp,
        } as Params),
      ],
      providers: [Logger],
      exports: [Logger],
    };
  }
}
