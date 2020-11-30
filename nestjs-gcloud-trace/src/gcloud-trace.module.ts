import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  Global,
} from '@nestjs/common';
import { ContextModule, Context } from '../../nestjs-context';
import { GcloudTraceService } from './services';
import { gcloudTraceContextMiddleware } from './middleware';

@Global()
@Module({
  imports: [ContextModule.register()],
  providers: [GcloudTraceService],
  exports: [GcloudTraceService],
})
export class GcloudTraceModule implements NestModule {
  private middlewaresConfigured = false;
  constructor(
    private readonly gcloudTracerService: GcloudTraceService,
    private readonly context: Context,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    if (this.middlewaresConfigured) {
      return;
    }
    consumer
      .apply(
        gcloudTraceContextMiddleware({
          gcloudTracerService: this.gcloudTracerService,
          contextService: this.context,
        }),
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    this.middlewaresConfigured = true;
  }
}
