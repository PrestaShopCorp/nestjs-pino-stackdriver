import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '../../src/';

async function bootstrap() {
  const appLogger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: appLogger,
  });

  await app.listen(3000);
}

bootstrap();
