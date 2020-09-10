import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import { HeaderNameInterface } from './header-name.interface';
import { Logger } from './logger.service';
import { pinoHttpConfig } from './pino-http.config';

@Module({})
export class LoggerModule {
  static forRoot(config: Params = {}, headerNames?: HeaderNameInterface) {
    const pinoHttp = pinoHttpConfig(headerNames);
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRoot({
          pinoHttp,
          ...config
        } as Params),
      ],
      providers: [Logger],
      exports: [Logger],
    };
  }
}
