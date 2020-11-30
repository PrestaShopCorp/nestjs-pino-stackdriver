# NestJs Pino Stackdriver

[Pino](https://github.com/pinojs/pino) logger for Nestjs adapted to be used with Stackdriver

## About

Nestjs Pino Stackdriver exports a LoggerService that includes a logger context, as the default logger implementation 
in Nest. It can be configured to log parts from the Request and to log parts of the default [context](nestjs-context/README.md) 
of the application. You can also set custom (static) labels.

Futhermore: 
* No need to call logger::setContext: if you have not called by yourself Logger::setContext, it automatically sets 
the name of the provider / controller class using the logger as context
* Use the logger as application logger
* Get the correlation-id in your provider or controllers with [correlation-id decorators](nestjs-correlation-id/README.md)
* Build Dtos from any request part with [BuildDto decorator](nestjs-ps-tools/README.md)

## Basic Usage

Include the module as an import into your main module. By default, it will be using the Stackdriver predefined 
configuration:

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { 
      PinoContextModule, 
      CorrelationIdModule,
      GcloudTraceModule,
} from 'nestjs-pino-stackdriver';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [
    CorrelationIdModule.register(),
    GcloudTraceModule,
    CqrsModule,
    PinoContextModule.register(),
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
```

If you want the logger to log correlation-id and gcloud trace, remember to import the corresponding modules,
and for gcloud tracer, to start the tracer; you may want to add custom labels to your logs too:

```typescript
// In your module:
import { Module } from '@nestjs/common';
import { 
  PinoContextModule, 
  PredefinedConfig,
  CorrelationIdModule,
  GcloudTraceModule,
} from 'nestjs-pino-stackdriver';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler'; import { PinoContextLogger } from './pino-context-logger.service';

@Module({
imports: [
  CorrelationIdModule.register(),
  GcloudTraceModule,
  PinoContextModule.register({
    base: PredefinedConfig.STACKDRIVER,
    labels: {
      env: [
        { label: 'project', value: 'example' },
        { label: 'node-env', path: 'NODE_ENV' },
      ],
      request: [
        {
          label: 'content-type',
          pick: { headers: ['content-type'] },
        },
        {
          label: 'entity-id',
          pick: [
            { query: ['fallback-id'], body: ['entity-id', 'id'] },
            { query: ['override-id'] },
          ],
        },
        {
          label: 'deep-in-body',
          pick: [{ body: ['deep.id'] }],
          path: 'deep-in-body.id',
        },
      ],
    },
  }),
]
(...)

// In your application:

import { NestFactory } from '@nestjs/core';
import { GcloudTraceService, createLoggerTool, PinoContextLogger } from 'nestjs-pino-stackdriver';
import { OnboardingModule } from './onboarding/my.module';

async function bootstrap() {
  const app = await NestFactory.create(MyModule, {logger: new PinoContextLogger()});
  // TODO
  // app.useLogger(createLoggerTool(app as any));
  await app.listen(3000);
}
GcloudTraceService.start();
bootstrap();
```

Now you can inject the logger in your providers or controllers and use it:
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PinoContextLogger } from 'nestjs-pino-stackdriver';
import { ExampleCommand } from './command/impl/example.command';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: PinoContextLogger,
  ) {
    // if you do not call setContext, "ExampleController" will be used as context
    // logger.setContext('my custom context');
  }

  @Post('/example')
  async example(
    @Body()
    command: ExampleCommand,
  ) {
    this.logger.verbose('Simple verbose message');
    this.logger.debug({
      msg: 'Object-like debug message',
      sample: 'another field',
    });
    this.logger.warn('Warning passing custom context', 'custom-context');
    this.logger.error(
      'Error',
      `An error trace`,
    );
    this.logger.log(
      'An interpolation message: %o correlation-id %s',
      undefined,
      { try: 1 },
      'xxx',
    );

    return this.commandBus.execute(command);
  }
}
```

### Backwards Compatibility

You can continue using your LoggerModule as you were using it before 1.x: 

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { 
  LoggerModule, 
} from 'nestjs-pino-stackdriver';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [
    LoggerModule,
    // or LoggerModule.forRoot({}), to pass your custom configuration 
    // but note that it will always use base = "stackdriver"
    CqrsModule,
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
```

You just need to stop using CorrelationTracerMiddleware, just call GcloudTraceService.start() instead:

```typescript
// 0.x
import { NestFactory } from '@nestjs/core';
import { MyModule } from './my/my.module';
import { CorrelationTracerMiddleware, Logger } from 'nestjs-pino-stackdriver';

async function bootstrap() {
  const app = await NestFactory.create(MyModule, {
    logger: new Logger(),
  });
  app.use(CorrelationTracerMiddleware({ app }));

  await app.init();
}

bootstrap();

// 1.x 
import { NestFactory } from '@nestjs/core';
import { MyModule } from './my/my.module';
import { GcloudTraceService, Logger } from 'nestjs-pino-stackdriver';

async function bootstrap() {
  const app = await NestFactory.create(MyModule, {
    logger: new Logger(),
  });

  await app.init();
}
GcloudTraceService.start();
bootstrap();
```

### Correlation-Id

This project include several decorators to get the correlation-id into your providers and controllers: 

* As event metadata (note: this decorator converts your event.metadata into an accessor descriptor instead of data 
descriptor)
```typescript
import { CorrelationIdMetadata } from 'nestjs-correlation-id';

@CorrelationIdMetadata()
export class ExampleEvent {
  constructor(public readonly data: any, public readonly metadata: any) {}
}
```

* Into a class property (note: this decorator converts your event.property into an accessor descriptor instead of data 
descriptor)
```typescript
import { CorrelationId } from 'nestjs-pino-stackdriver'; 

export class InternalServerErrorException {
  @CorrelationId()
  private readonly correlationId;
}
```

* Into a sub-property for a class property
```typescript
import { AddCorrelationId } from 'nestjs-pino-stackdriver';

@AddCorrelationId('property.correlation_id')
export class ExampleClass {
  private readonly property = {}; // property.correlation_id will be added / overwritten 
}
```

### BuildDto

Use the BuildDto decorator to facilitate the creation of your CQRS commands or your DTOs:

```typescript
  import { Controller, Post } from '@nestjs/common';
  import { CommandBus } from '@nestjs/cqrs';
  import { BuildDto } from 'nestjs-pino-stackdriver';
  import { ExampleCommand } from './example/src/command/impl/example.command';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/example')
  async example(
    @BuildDto({
      query: false,
      body: Object.getOwnPropertyNames(new ExampleCommand()),
      headers: ['x-correlation-id'],
    })
    command: ExampleCommand,
  ) {
    return this.commandBus.execute(command);    
  }
```

## Further Configuration

* See [nestjs-pino-stackdriver](nestjs-pino-stackdriver/README.md#further-configuration) for more information about the logger.
* See [nestjs-correlation-id](nestjs-correlation-id/README.md) for more information about the correlation id.
* See [nestjs-ps-tools](nestjs-ps-tools/README.md) for more information about BuildDto.

## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nestjs-pino-stackdriver/issues). 

## Ressources

* [contributors](https://github.com/PrestaShopCorp/nestjs-pino-stackdriver/graphs/contributors)

## Examples 

There is a full working example in the directory "example" of each project inside this project: 

* [Nest-Pino-Context](nestjs-pino-stackdriver)
* [Context](nestjs-pino-stackdriver)    
* [Correlation-Id](nestjs-correlation-id)    
* [Gcloud-Trace](nestjs-gcloud-trace)    
* [Tools](nestjs-ps-tools)
