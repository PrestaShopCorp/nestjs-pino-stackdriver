import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorrelationTracerMiddleware, Logger } from '../../src/';

async function bootstrap() {
  const appLogger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: appLogger,
  });

  app.use(
    CorrelationTracerMiddleware({
      app: app,
      agent: require('@google-cloud/trace-agent').start(),
    }),
  );

  await app.listen(3000);
}

bootstrap();
