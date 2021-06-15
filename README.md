# NestJs Pino Stackdriver

[Pino](https://github.com/pinojs/pino) logger for Nestjs that logs context and execution-context labels using 
[nest-context](https://github.com/PrestaShopCorp/nestjs-context) 

## About

The logger exported in this project implements the LoggerService interface of Nest and includes the logger context,
as the default logger implementation in Nest. It can be configured to log labels from the
[execution context](https://github.com/PrestaShopCorp/nestjs-context) of the application.

Furthermore: 
* If you have not called by yourself Logger::setContext, it adds the name of the provider / controller class using 
the logger as context
* It includes predefined logger formats (fex: "stackdriver") 
* It includes a tool that allows to use the logger as your application logger
* It includes a module GcloudTraceModule that allows to add the gcloud trace-url to the context and response headers

## Basic Usage

Include the module as an import into your main module:

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino-context';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [
    CqrsModule,
    LoggerModule,
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
```

Now you can inject the logger in your providers or controllers and use it:
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Logger } from 'nestjs-pino-context';
import { ExampleCommand } from './command/impl/example.command';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: Logger,
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

### Application Logger

You can use the logger to log your application logs:
```typescript
import { NestFactory } from '@nestjs/core';
import { GcloudTraceService } from 'nestjs-gcloud-trace';
import { createLoggerTool, createStackdriverLoggerTool } from 'nestjs-pino-context';
import { MyModule } from './my.module';

async function bootstrap() {
  const app = await NestFactory.create(MyModule);
  
  // Pass the app and it will instantiate your logger from the DI
  app.useLogger(createStackdriverLoggerTool(app));
  return await app.listen(3000);
}
GcloudTraceService.start();
bootstrap();
```

You can use also use the logger to log your application + initialization logs:
```typescript
import { NestFactory } from '@nestjs/core';
import { GcloudTraceService } from 'nestjs-gcloud-trace';
import { createLoggerTool } from 'nestjs-pino-context';
import { MyModule } from './my.module';
import { myLoggerConfig } from './my-logger.config';

async function bootstrap() {
  const app = await NestFactory.create(MyModule, {logger: createStackdriverLoggerTool()});
  // You could also use a custom logger createLoggerTool instead of the stackdriver one
  const app2 = await NestFactory.create(MyModule, {logger: createLoggerTool(myLoggerConfig)});
  
  return await app.listen(3000);
}
GcloudTraceService.start();
bootstrap();
```

## Further Configuration

When you register the Logger, you can pass as configuration either a string representing the name of
one of the [bundled configurations](src/config)  (``Fex: 'stackdriver'``), or an object containing zero or more of:

*  base?: PredefinedConfigOptionType: A string representing one of the bundled configurations (``Fex: 'stackdriver'`).
   The "base" configuration will be loaded and customised with the rest of given the configurations.
* loggerOptions?: LoggerOptions:
  Pino logger can be configured using [LoggerOptions](https://github.com/pinojs/pino/blob/master/docs/api.md#options)
* logFieldNames?: {
  context: string;
  labels: string;
  trace: string;
  }: Can be used to override the logger output names of the context, labels and error trace fields
* context?: [Configuration for nestjs-context](https://github.com/PrestaShopCorp/nestjs-context/blob/master/src/interfaces/config.type.ts)

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino-context';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [
    CqrsModule,
    LoggerModule.register({
      
    }),
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
```


The default ```Logger``` uses the stackdriver as default bundled configuration. 
If you want an empty configuration by default, you can use ```PinoContextLogger``` instead:

## Gcloud Trace Module

GcloudTraceModule uses internally [nest-context](https://github.com/PrestaShopCorp/nestjs-context) to store the trace 
url (something like "projects/<project-id>/traces/<trace-id>"), so you can use the context later to show your trace-url 
in your logs.

Furthermore, it allows to:

* Get the cloud trace agent anywhere in your code as a DI (see GcloudTracerService)
* Force requests to be traced (using a middleware that sets the "x-cloud-trace-context" header)

### Basic Usage

Include the module as an import into your main module:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GcloudTraceModule } from 'nestjs-gcloud-trace';
import { ExampleController } from './example.controller';

@Module({
  imports: [ConfigModule.forRoot(), GcloudTraceModule],
  controllers: [ExampleController],
  providers: [],
})
export class ExampleModule {}
```

Call GcloudTraceService::start (static method) before your Nest bootstrap:
```typescript
import { NestFactory } from '@nestjs/core';
import { GcloudTraceService } from 'nestjs-gcloud-tracer';
import { ExampleModule } from './example.module';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
  await app.listen(9191);
}
GcloudTraceService.start();
bootstrap();
```

Now now you can the gcloud trace context id from your headers and you can use the context key exported within this
module to get the current trace url from the default context:
```typescript
import { Controller, Get } from '@nestjs/common';
import { Context } from 'nestjs-context';
import {
  CONTEXT_GCLOUD_TRACE,
  HEADER_GCLOUD_TRACE_CONTEXT_ID,
} from 'nestjs-gcloud-trace/constants';

@Controller()
export class ExampleController {
  constructor(
    private readonly context: Context,
  ) {}

  @Get('/example')
  async example(@Headers('HEADER_GCLOUD_TRACE_CONTEXT_ID') header: string) {
    return `Your Gcloud Trace url is ${this.context.get(
      CONTEXT_GCLOUD_TRACE,
    )} and your current context id is ${header}`;
  }
}
```

You can also use the gcloud trace agent directly:

```typescript
import { Controller, Get } from '@nestjs/common';
import { GcloudTraceService } from 'nestjs-gcloud-trace';

@Controller()
export class ExampleController {
  constructor(
    private readonly gcloudTracerService: GcloudTraceService,
  ) {}

  @Get('/example')
  async example() {
    return `Your Gcloud trace current context id is ${this.gcloudTracerService.get().getCurrentContextId();
  }
}
```

### Advanced Usage

You may want one, multiple or all requests to be traced by Gcloud Trace: this module includes a middleware that allows
to filter requests to force them to be traced:

```typescript
import { NestFactory } from '@nestjs/core';
import { Request } from 'express';
import { GcloudTraceService, forceRequestToBeTracedMiddleware } from 'nestjs-gcloud-trace';
import { ExampleModule } from './example.module';

async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
  // example: force all "GET" requests to be traced
  app.use(
    forceRequestToBeTracedMiddleware(
      app.get(GcloudTraceService),
      (req: Request) => req.method === 'GET',
    ),
  );
  await app.listen(9191);
}
GcloudTraceService.start();
bootstrap();
```


## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nestjs-pino-context/issues). 


## Resources

* [contributors](https://github.com/PrestaShopCorp/nestjs-pino-context/graphs/contributors)
* [nest-context](https://github.com/PrestaShopCorp/nestjs-context)

## Examples 

There is a full working example in the directory "example" of this project ([here!](example/)).

Use "yarn start" to execute the example script (from the "example" directory):
```
yarn install
NODE_ENV=development yarn start
```

Now you can open another terminal and execute a curl to see the results of a POST:
```
curl --location --request POST 'http://127.0.0.1:9191/example/param-id' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "body-id",
    "override-id": "override-id",
    "deep": {"id": "deep-id"}
}'
```

Try now with a different NODE_ENV environment variable and a different CURL, for example:
```
curl --location --request POST 'http://127.0.0.1:9191/example/param-id?fallback-id=ok' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "body-id",
    "override-id": "override-id",
    "block-override": 1
}'
```

If you want to include GCloud Trace:
* Remember to change the value of the .env included in the example to correctly trace your application.
* You can force the traces for all your GET requests with FORCE_REQUEST_TRACE=true.
* Now you can open another terminal and execute a curl to see the results of a GET:
```
curl --location --request GET 'http://127.0.0.1:9191/example'
```

* You can check your trace in the url:
```
https://console.cloud.google.com/traces/list?project=<project-id>&tid=<trace-id>
```


## WIP

* When we have created Nestjs-Gcloud-Trace module, for the default context config to use it
* Test if it's working with Stackdriver. If tracing is not working, we need to change 'logging.googleapis.com/trace' 
field to be 3 fields instead: trace, spanId and traceSampled 
(as defined [here](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry)).
To be able to do that, we only need to add the 3 fields in the context key and to define deep-labels for each one

## TODO

* Unit Tests
* Only tested with Express: try it on other platforms
* RegisterAsync to be able to use configService for logger configs
