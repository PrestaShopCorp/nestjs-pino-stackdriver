import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PinoContextModule } from '../../src';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';
import { loggerConfig } from './logger.config';

@Module({
  imports: [CqrsModule, PinoContextModule.register(loggerConfig)],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
