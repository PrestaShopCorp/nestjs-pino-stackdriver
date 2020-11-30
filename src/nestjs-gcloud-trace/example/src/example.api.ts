import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {
  GcloudTraceService,
  forceRequestToBeTracedMiddleware,
} from '../../src';
import { ExampleModule } from './example.module';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
  const configService = app.get(ConfigService);
  if (configService.get<string>('FORCE_REQUEST_TRACE') === 'true') {
    app.use(
      forceRequestToBeTracedMiddleware(
        app.get(GcloudTraceService),
        (req: Request) => req.method === 'GET',
      ),
    );
  }
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  await app.listen(9191);
}
GcloudTraceService.start();
bootstrap();
