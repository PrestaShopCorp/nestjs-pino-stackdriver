import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { CorrelationIdModule } from '../../../../src';
import { EXAMPLE_QUEUE } from '../constants';
import { ExampleProcessor } from './example.processor';

@Module({
  imports: [
    CorrelationIdModule.register(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: EXAMPLE_QUEUE,
    }),
  ],
  controllers: [],
  providers: [ExampleProcessor],
})
export class ProcessorModule {}
