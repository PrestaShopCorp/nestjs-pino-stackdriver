import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CorrelationId } from '../../../../../nestjs-correlation-id';
import { ExampleCommand } from '../impl/example.command';
import { PinoContextLogger } from '../../../../src';

@CommandHandler(ExampleCommand)
export class ExampleHandler implements ICommandHandler<ExampleCommand> {
  @CorrelationId()
  private correlationId: string;

  constructor(private readonly logger: PinoContextLogger) {}

  async execute(command: ExampleCommand) {
    this.logger.error(
      'Handler error with class-defined context',
      `An error trace`,
    );

    this.logger.log(
      'An interpolation message: %o correlation-id %s',
      undefined,
      { try: 1 },
      this.correlationId,
    );

    return command;
  }
}
