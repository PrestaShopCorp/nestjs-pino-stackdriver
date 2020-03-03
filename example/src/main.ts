import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '../../src/logger.service';
import { CorrelationIdMiddleware } from '../../src/correlation-id.middleware';
import { TracerMiddleware } from '../../src/tracer.middleware';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });
  app.use(CorrelationIdMiddleware(logger));
  app.use(TracerMiddleware(logger))
  await app.listen(3000);
}

bootstrap();
