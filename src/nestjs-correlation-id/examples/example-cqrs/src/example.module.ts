import { Module, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CorrelationIdModule } from '../../../src';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handlers/example.handler';

@Module({
  imports: [CqrsModule, CorrelationIdModule.register()],
  controllers: [ExampleController],
  providers: [Logger, ExampleHandler],
})
export class ExampleModule {}
