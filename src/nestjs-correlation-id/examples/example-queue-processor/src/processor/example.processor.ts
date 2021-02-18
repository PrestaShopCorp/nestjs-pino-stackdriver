import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { CorrelationId } from '../../../../src/decorators';
import { EXAMPLE_QUEUE } from '../constants';
import { SetCorrelationIdFrom } from '../../../../src/decorators/correlation-id/set-correlation-id.from';

@Processor(EXAMPLE_QUEUE)
export class ExampleProcessor {
  @CorrelationId()
  private correlationId: string;

  private readonly logger = new Logger(ExampleProcessor.name);

  @Process()
  @SetCorrelationIdFrom('id')
  handle(job: Job) {
    this.logger.log(
      `Correlation Id : ${this.correlationId} - jobId : ${job.id} - data : ${job.data.sms}`,
    );
  }
}
