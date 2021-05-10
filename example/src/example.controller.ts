import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ExampleCommand } from './command/impl/example.command';
import { PinoContextLogger } from '../../src';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: PinoContextLogger,
  ) {}

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
