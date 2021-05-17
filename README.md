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

## Basic Usage

Include the module as an import into your main module:

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PinoContextModule } from 'nestjs-pino-context';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [
    CqrsModule,
    PinoContextModule,
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
```
You can also use the 0.x and 1.x LoggerModule alias, that will be autoconfigured with
Stackdriver logs format:
```
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { 
  LoggerModule, 
} from 'nestjs-pino-stackdriver';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [
    LoggerModule, // or LoggerModule.forRoot() or LoggerModule.forRoot({})
    CqrsModule,
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
import { PinoContextLogger } from 'nestjs-pino-context';
import { ExampleCommand } from './command/impl/example.command';

@Controller()
export class ExampleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: PinoContextLogger,
    //you can also use the "Logger" alias, if you used 0.x/1.x LoggerModule:
    private readonly loggerAlias: Logger,
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

You can use the logger to log your application logs

```typescript
import { NestFactory } from '@nestjs/core';
import { GcloudTraceService } from 'nestjs-gcloud-trace';
import { createLoggerTool, createStackdriverLoggerTool } from 'nestjs-pino-context';
import { MyModule } from './my.module';

async function bootstrap() {
  const app = await NestFactory.create(MyModule);
  
  // Pass the app to createLoggerTool and it will instantiate your logger from the DI
  app.useLogger(createLoggerTool(app));
  return await app.listen(3000);
}
GcloudTraceService.start();
bootstrap();
```
You can use also use the logger to log your application + initialization logs

```typescript
import { NestFactory } from '@nestjs/core';
import { GcloudTraceService } from 'nestjs-gcloud-trace';
import { createLoggerTool } from 'nestjs-pino-context';
import { MyModule } from './my.module';
import { myLoggerConfig } from './my-logger.config';

async function bootstrap() {
  // pass your logger config to createLoggerTool and it will
  // create a logger with your config and using the default context
  const app = await NestFactory.create(MyModule, {logger: createLoggerTool(myLoggerConfig)});
  // You could also use the preconfigured createStackdriverLoggerTool instead
  const app2 = await NestFactory.create(MyModule, {logger: createStackdriverLoggerTool()});
  
  return await app.listen(3000);
}
GcloudTraceService.start();
bootstrap();
```

## Further Configuration

When you register the PinoContextModule, you can pass as configuration either a string representing the name of 
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

## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nestjs-pino-context/issues). 


## Ressources

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
