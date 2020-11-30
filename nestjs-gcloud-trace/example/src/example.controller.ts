import { Controller, Logger, Get, Headers } from '@nestjs/common';
import { Context } from '../../../nestjs-context';
import {
  GcloudTraceService,
  CONTEXT_GCLOUD_TRACE,
  HEADER_GCLOUD_TRACE_CONTEXT,
} from '../../src';

@Controller()
export class ExampleController {
  private readonly logger = new Logger(ExampleController.name);

  constructor(
    private readonly gcloudTracerService: GcloudTraceService,
    private readonly context: Context,
  ) {}

  @Get('/example')
  async example(@Headers() headers: any) {
    this.logger.debug(
      `Get current context id from gcloud tracer service: ${this.gcloudTracerService
        .get()
        .getCurrentContextId()}`,
    );
    this.logger.debug(
      `Get gcloud trace context header value (used to force this request to be traced): ${headers[HEADER_GCLOUD_TRACE_CONTEXT]}`,
    );
    return `Your Gcloud Tracer url is ${this.context.get(
      CONTEXT_GCLOUD_TRACE,
    )}`;
  }
}
