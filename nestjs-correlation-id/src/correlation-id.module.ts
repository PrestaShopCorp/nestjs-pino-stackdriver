import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  Provider,
} from '@nestjs/common';
import { ContextModule, Context } from '../../nestjs-context';
import { correlationIdMiddleware } from './middleware';
import { CorrelationIdConfigInterface } from './interfaces';
import { CorrelationIdConfig } from './correlation-id.config';

@Module({
  imports: [ContextModule.register()],
})
export class CorrelationIdModule implements NestModule {
  static register(config: CorrelationIdConfigInterface = {}) {
    const correlationIdConfig: Provider<CorrelationIdConfig> = {
      provide: CorrelationIdConfig,
      useValue: new CorrelationIdConfig(config),
    };

    return {
      module: CorrelationIdModule,
      providers: [correlationIdConfig],
      exports: [],
    };
  }

  constructor(
    private readonly config: CorrelationIdConfig,
    private readonly context: Context,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(correlationIdMiddleware(this.config, this.context))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
