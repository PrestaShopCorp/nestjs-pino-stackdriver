import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExampleModule } from './example.module';
import { Context } from '../../src';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  // set a message in the default context, globally
  app
    .get(Context)
    .set('example-top-level', 'top-level default context message');

  await app.listen(9191);
}

bootstrap();
