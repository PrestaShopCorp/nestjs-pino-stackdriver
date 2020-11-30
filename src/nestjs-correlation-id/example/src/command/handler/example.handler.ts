import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AddCorrelationId,
  CorrelationId,
  HEADER_CORRELATION_ID,
} from '../../../../src';
import { ExampleCommand } from '../impl/example.command';
import { ExampleEvent } from '../../events/example.event';

@CommandHandler(ExampleCommand)
@AddCorrelationId('correlationId')
export class ExampleHandler implements ICommandHandler<ExampleCommand> {
  private readonly correlationId: string;

  @CorrelationId()
  private readonly correlationIdAgain: string;
  constructor(private readonly logger: Logger) {}

  async execute(command: ExampleCommand) {
    this.logger.debug(
      `You can add the correlation id to a class property using the AddCorrelationId ` +
        `decorator (${this.correlationId}) or the CorrelationId decorator (${this.correlationIdAgain})`,
    );

    const event = new ExampleEvent(command, { created_at: new Date() });
    this.logger.debug(
      `You can also add to your event::metadata property a correlation_id using ` +
        `CorrelationIdMetadata decorator (${event.metadata.correlation_id})`,
    );

    return `Command handler printing: id: ${command.id}, correlation-id: ${command[HEADER_CORRELATION_ID]} `;
  }
}
