import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Context, InjectContext } from '../../../../src';
import { ExampleCommand } from '../impl/example.command';

@CommandHandler(ExampleCommand)
export class ExampleHandler implements ICommandHandler<ExampleCommand> {
  private logger: Logger = new Logger();
  constructor(
    private readonly defaultContext: Context,
    @InjectContext('CONTROLLER_CONTEXT')
    private readonly controllerContext: Context,
  ) {}

  async execute(command: ExampleCommand) {
    this.defaultContext.set(
      'example-handler',
      'This is just a message from the handler',
    );
    this.logger.debug(
      `Command handler printing ${this.defaultContext.get(
        'example-top-level',
      )}`,
    );
    this.logger.debug(
      `Command handler printing ${this.defaultContext.get(
        'example-top-level-di',
      )}`,
    );
    this.logger.debug(
      `Command handler printing ${this.defaultContext.get(
        'example-controller',
      )}`,
    );
    this.logger.debug(
      `Command handler printing ${this.controllerContext.get(
        'example-controller',
      )}`,
    );
    return `Command handler printing ${this.defaultContext.get(
      'example-handler',
    )}`;
  }
}
