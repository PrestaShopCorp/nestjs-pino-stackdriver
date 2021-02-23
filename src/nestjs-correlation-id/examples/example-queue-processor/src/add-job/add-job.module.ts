import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AddJobController } from './add-job.controller';
import { EXAMPLE_QUEUE } from '../constants';

@Module({
  imports: [
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
  controllers: [AddJobController],
})
export class AddJobModule {}
