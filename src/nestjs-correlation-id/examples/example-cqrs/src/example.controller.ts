import { Controller, Headers, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BuildDto } from '../../../../nestjs-ps-tools';
import { HEADER_CORRELATION_ID } from '../../../src';
import { ExampleCommand } from './command/impl/example.command';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
  ) {}

  @Post('/example')
  async example(
    @BuildDto({
      body: Object.getOwnPropertyNames(new ExampleCommand()),
      headers: [HEADER_CORRELATION_ID],
    })
    command: ExampleCommand,
    @Headers(HEADER_CORRELATION_ID) correlationId: string,
  ) {
    this.logger.debug(
      `If you did not pass an ${HEADER_CORRELATION_ID} header, correlation id will be auto-generated: ${correlationId}`,
    );

    return this.commandBus.execute(command);
  }
}
