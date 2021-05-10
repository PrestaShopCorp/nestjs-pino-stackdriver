import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExampleModule } from './example.module';
// import { GcloudTraceService } from '../../../nestjs-gcloud-trace/src';
import { createLoggerTool } from '../../src';
import { loggerConfig } from './logger.config';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule, {
    logger: createLoggerTool(loggerConfig),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  await app.listen(9191);
}
// GcloudTraceService.start({
//   samplingRate: 1,
// });

bootstrap();
