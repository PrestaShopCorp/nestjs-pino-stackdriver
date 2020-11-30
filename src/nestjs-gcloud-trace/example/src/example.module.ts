import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GcloudTraceModule } from '../../src';
import { ExampleController } from './example.controller';

@Module({
  imports: [ConfigModule.forRoot(), GcloudTraceModule],
  controllers: [ExampleController],
})
export class ExampleModule {}
