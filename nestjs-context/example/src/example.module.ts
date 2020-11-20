import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextModule } from '../../src';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [CqrsModule, ContextModule.register()],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
