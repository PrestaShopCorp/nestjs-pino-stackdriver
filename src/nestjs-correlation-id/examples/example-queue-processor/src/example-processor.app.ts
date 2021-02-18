import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ProcessorModule } from './processor/processor.module';

async function bootstrap() {
  const app = await NestFactory.create(ProcessorModule);
  try {
    await app.init();
  } catch (err) {
    const logger = new Logger();
    logger.error(
      `could not init nestjs app, error: ${err}\n exiting with code 5`,
    );
    process.exit(5);
  }
}

bootstrap();
