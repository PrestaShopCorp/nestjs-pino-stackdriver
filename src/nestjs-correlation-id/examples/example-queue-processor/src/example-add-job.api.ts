import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AddJobModule } from './add-job/add-job.module';

async function bootstrap() {
  const app = await NestFactory.create(AddJobModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  await app.listen(9191);
}

bootstrap();
