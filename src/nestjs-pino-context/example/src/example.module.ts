import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Request } from 'express';
import { CorrelationIdModule } from '../../../nestjs-correlation-id/src';
import { GcloudTraceModule } from '../../../nestjs-gcloud-trace/src';
import { PinoContextModule, PredefinedConfig } from '../../src';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

const config =
  process.env.NODE_ENV !== 'production'
    ? {
        base: PredefinedConfig.STACKDRIVER,
        logFieldNames: {
          trace: 'error',
        },
        labels: {
          env: [
            {
              label: 'project',
              value: 'example',
            },
            { label: 'node-env', path: 'NODE_ENV' },
          ],
          request: [
            {
              label: 'content-type',
              pick: { headers: ['content-type'] },
            },
            {
              label: 'visible-if-fallback-id',
              pick: { query: ['fallback-id'], body: ['not-shown'] },
            },
            {
              label: 'entity-id',
              pick: [
                { body: ['id'], params: ['id'] },
                {
                  body: ['override-id'],
                  filter: (req: Request) => !req.body['block-override'],
                },
              ],
            },
            {
              label: 'deep-in-body',
              pick: [{ body: ['deep.id'] }],
              path: 'deep-in-body.id',
            },
          ],
        },
      }
    : PredefinedConfig.STACKDRIVER;

@Module({
  imports: [
    CorrelationIdModule.register(),
    GcloudTraceModule,
    CqrsModule,
    PinoContextModule.register(config),
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
