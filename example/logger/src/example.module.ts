import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GcloudTraceModule, LoggerModule } from '../../../src';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';
import { ConfigModule } from '@nestjs/config';
import { ContextModule } from 'nestjs-context';
import { loggerContextConfig } from '../../../src/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ContextModule.register(loggerContextConfig),
    GcloudTraceModule,
    CqrsModule,
    LoggerModule,
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
