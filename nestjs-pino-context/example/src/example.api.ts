import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExampleModule } from './example.module';
import { GcloudTraceService } from '../../../nestjs-gcloud-trace/src';
import { createLoggerTool } from '../../src';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
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
