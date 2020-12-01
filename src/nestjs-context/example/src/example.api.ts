import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExampleModule } from './example.module';
import { Context } from '../../src';
import { defaultContext } from '../../src/default.context';

async function bootstrap() {
  defaultContext.set(
    'example-top-level',
    'default context message using the default context variable',
  );
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
    .set('example-top-level-di', 'top-level default context message using DI');

  await app.listen(9191);
}

bootstrap();
