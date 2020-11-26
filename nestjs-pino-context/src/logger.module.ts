import { Module, Provider } from '@nestjs/common';
import { PinoContextModule } from './pino-context.module';
import { Logger } from './logger.service';
import { CorrelationIdModule } from '../../nestjs-correlation-id/src';
import { GcloudTraceModule } from '../../nestjs-gcloud-trace/src';
import { DiscoveryModule } from '@nestjs/core';
import { ContextModule } from '../../nestjs-context/src';

const pinoContextModule = PinoContextModule.register();

@Module({
  imports: [DiscoveryModule, ContextModule.register(), CorrelationIdModule.register(), GcloudTraceModule],
  providers: [...(pinoContextModule.providers as Provider[]), Logger],
  exports: [...(pinoContextModule.exports as Provider[]), Logger],
})
export class LoggerModule {}
