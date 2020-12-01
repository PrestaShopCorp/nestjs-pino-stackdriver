import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExampleModule } from './example.module';
import { GcloudTraceService } from '../../../nestjs-gcloud-trace/src';
import {
  createLoggerTool,
  PinoContextLogger,
  PinoContextConfig,
} from '../../src';
import { loggerConfig } from './logger.config';

async function bootstrap() {
  const logger = new PinoContextLogger(new PinoContextConfig(loggerConfig));
  const app = await NestFactory.create(ExampleModule, {
    logger,
  });
  app.useLogger(createLoggerTool(app));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  await app.listen(9191);
}
GcloudTraceService.start({
  samplingRate: 1,
});

bootstrap();
