import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ExampleCommand } from './command/impl/example.command';
import { PinoContextLogger } from '../../src';
import { BuildDto } from '../../../nestjs-ps-tools/src/decorators';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: PinoContextLogger,
  ) {}

  @Post('/example/:id')
  async example(
    @BuildDto([{ body: ['id'], params: ['id'] }, { body: ['override-id'] }])
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
