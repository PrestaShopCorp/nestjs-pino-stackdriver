import { Controller, Logger, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { EXAMPLE_QUEUE } from '../constants';

@Controller()
export class AddJobController {
  private readonly logger = new Logger(AddJobController.name);

  constructor(@InjectQueue(EXAMPLE_QUEUE) private readonly queue: Queue) {}

  @Post('/add-job')
  async addJob() {
    this.logger.log('Adding job');
    await this.queue.add({
      sms: 'my-example-data',
    });
  }
}
