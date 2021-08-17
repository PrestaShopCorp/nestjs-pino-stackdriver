import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExampleModule } from './example.module';
import {
  GcloudTraceService,
  forceRequestToBeTracedMiddleware,
  createStackdriverLoggerTool,
} from '../../../src';

async function bootstrap() {
  const logger = createStackdriverLoggerTool();
  const app: INestApplication = await NestFactory.create(ExampleModule, {
    logger,
  });
  app.useLogger(createStackdriverLoggerTool(app));
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
