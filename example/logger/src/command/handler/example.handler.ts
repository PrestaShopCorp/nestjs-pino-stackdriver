import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExampleCommand } from '../impl/example.command';
import { Logger } from '../../../../../src';

@CommandHandler(ExampleCommand)
export class ExampleHandler implements ICommandHandler<ExampleCommand> {
  constructor(private readonly logger: Logger) {}

  async execute(command: ExampleCommand) {
    this.logger.error(new Error('Handler error with class-defined context'));

    this.logger.log(
      'An interpolation message: %o hello %s',
      undefined,
      { try: 'to say' },
      'world',
    );

    return command;
  }
}
