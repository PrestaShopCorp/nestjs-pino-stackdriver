import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ExampleCommand } from './command/impl/example.command';
import {
  GcloudTraceService,
  HEADER_GCLOUD_TRACE_CONTEXT,
  Logger,
} from '../../../src';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
    private readonly gcloudTracerService: GcloudTraceService,
  ) {}

  @Get('/trace')
  async trace(@Headers() headers: any) {
    this.logger.debug(
      `Get current context id from gcloud tracer service: ${this.gcloudTracerService
        .get()
        .getCurrentContextId()}`,
    );
    this.logger.debug(
      `Get gcloud trace context header value (used to force this request to be traced): ${headers[HEADER_GCLOUD_TRACE_CONTEXT]}`,
    );
    return true;
  }

  @Post('/example/:id')
  async example(
    @Body()
    command: ExampleCommand,
  ) {
    this.logger.verbose(
      `Simple verbose message from the controller - id: ${command.id}`,
    );
    this.logger.debug({
      msg: 'Object-like debug message',
      sample: 'another field',
    });
    this.logger.warn('Warning passing custom context', 'custom-context');

    return this.commandBus.execute(command);
  }
}
