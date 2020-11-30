import { Controller, Get, Param, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Context, InjectContext } from '../../src';
import { ExampleCommand } from './command/impl/example.command';

@Controller()
export class ExampleController {
  private logger: Logger = new Logger();
  constructor(
    private readonly commandBus: CommandBus,
    private readonly defaultContext: Context,
    @InjectContext('CONTROLLER_CONTEXT')
    private readonly controllerContext: Context,
  ) {}

  @Get('/example/:id')
  async getShop(@Param() command: ExampleCommand) {
    this.defaultContext.set(
      'example-controller',
      'controller default context message',
    );
    this.controllerContext.set(
      'example-controller',
      'controller decorator context message',
    );
    this.logger.log(this.defaultContext.toString());

    return this.commandBus.execute(command);
  }
}
