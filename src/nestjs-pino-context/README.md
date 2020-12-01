# NestJs Pino Context

[Pino](https://github.com/pinojs/pino) logger for Nestjs that logs context and context and request labels using 
[nest-context](https://github.com/PrestaShopCorp/nestjs-context) 

## About

The logger exported in this project implements the LoggerService interface of Nest and includes logger context,
as the default logger implementation in Nest. It can be configured to log labels from the Request, from the
default [context](https://github.com/PrestaShopCorp/nestjs-context) of the application and you can also set custom
(static) labels.

Futhermore: 
* If you have not called by yourself Logger::setContext, it adds the name of the provider / controller class using 
the logger as context
* It includes predefined logger formats (fex: "stackdriver") 
* It includes a tool that allows to use the logger as your application logger
* By default, it logs correlation id if you are using [nestjs-correlation-id](https://github.com/PrestaShopCorp/nestjs-correlation-id)
* By default, it logs gcloud trace if you are using [nestjs-gcloud-trace](https://github.com/PrestaShopCorp/nestjs-gcloud-trace)

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

### Adding custom labels to your logs

You can configure your logger to include environment, request and context labels on each log:

```typescript
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { 
  PinoContextModule, 
} from 'nestjs-pino-stackdriver';
import { ExampleController } from './example.controller';
import { ExampleHandler } from './command/handler/example.handler';

@Module({
  imports: [
    PinoContextModule.register({
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
    CqrsModule,
  ],
  controllers: [ExampleController],
  providers: [ExampleHandler],
})
export class ExampleModule {}
```

The logger will add an "x-correlation-id" label into your logs if you are using CorrelationIdModule from 
[nestjs-correlation-id](https://github.com/PrestaShopCorp/nestjs-correlation-id). It will also include a
"logging.googleapis.com/trace" field if you are using GcloudTrace module from 
[nestjs-gcloud-trace](https://github.com/PrestaShopCorp/nestjs-gcloud-trace) (remember to start the tracer in 
you main application):

```typescript
// In your module:
import { Module } from '@nestjs/common';
import { PinoContextModule, PredefinedConfig } from 'nestjs-pino-context';
import {
  CorrelationIdModule,
} from 'nestjs-correlation-id';
import {
  GcloudTraceModule,
} from 'nestjs-gcloud-trace';

@Module({
imports: [
  CorrelationIdModule.register(),
  GcloudTraceModule,
  PinoContextModule.register({
    base: PredefinedConfig.STACKDRIVER,
  }),
]
(...)

// In your application:

import { NestFactory } from '@nestjs/core';
import { GcloudTraceService } from 'nestjs-gcloud-trace';
import { createLoggerTool, PinoContextLogger } from 'nestjs-pino-context';
import { MyMoule } from './my.module';

async function bootstrap() {
  const app = await NestFactory.create(MyModule);
  await app.listen(3000);
}
GcloudTraceService.start();
bootstrap();
```

Note that the automatic "x-correlation-id" label is set by using a "labels::context" configuration, so if
you need to add custom context labels, and you want to keep using the x-correlation-id, you will need to
add the x-correlation-id context label as well:

```typescript
  PinoContextModule.register({
    base: PredefinedConfig.STACKDRIVER,
    labels: {
      context: ['x-correlation-id', 'my-context-label']
    }
  });
```

In the same way, "logging.googleapis.com/trace" field is set through a "fields::context" configuration:
```typescript
  PinoContextModule.register({
    base: PredefinedConfig.STACKDRIVER,
    labels: {
      context: ['x-correlation-id', 'my-context-label']
    }
    fields: {
      context: ['logging.googleapis.com/trace', 'my-context-field']
    }
  });
```

### Application Logger

You can use the logger to log your application logs

```typescript
import { NestFactory } from '@nestjs/core';
import { GcloudTraceService } from 'nestjs-gcloud-trace';
import { createLoggerTool } from 'nestjs-pino-context';
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
  return await app.listen(3000);
}
GcloudTraceService.start();
bootstrap();
```

## Further Configuration

When you register the PinoContextModule, you can pass as configuration either a string representing the name of 
one of the [bundled configurations](src/config)  (``Fex: 'stackdriver'``) or an object containing zero or more of:

*  base?: PredefinedConfigOptionType: A string representing one of the bundled configurations (``Fex: 'stackdriver'`).
The "base" configuration will be loaded and customised with the rest of given the configurations.
* loggerOptions?: LoggerOptions:
    Pino logger can be configured using [LoggerOptions](https://github.com/pinojs/pino/blob/master/docs/api.md#options)

*  fields?: LogFieldsConfigType; First level log fields. See "labels" for more information (same format).
*  labels?: LogFieldsConfigType; Log properties inside "[labels]" field.
   See logFieldNames configuration to configure the labels field name.

    * env?: LogFieldsConfigPartEnvType[]; An array of objects representing a set of custom-static or environment values 
        ```
        labels: [
            {
                label: 'custom', 
                value: 'custom-value'
            }, 
            {
                label: 'node-env', 
                path: 'NODE_ENV'
            }
        ],
      ```
    
    * context?: LogFieldsConfigPartContextType[]; An array of [context field configurations](src/types/config/log-fields-config-part-context.type.ts).
        The logger will dynamically use them to get the labels values from the [default context](https://github.com/PrestaShopCorp/nestjs-context)
        
        ```
          contextLabels: ['x-correlation-id', {
            label: 'output-label',
            path: 'output-label.key-if-object',
          }], 
        ```
    * request?: LogFieldsConfigPartRequestType[]: An array of [request field configurations](src/types/config/log-fields-config-part-request.type.ts) 
        that will be used by the logger to pick labels from the request.
        
        Each one is something like: 
        ```
          label: string; // name of the label in the output
          pick: PickFromRequestType; // defines where to look for the label in the request
          path?: string; // if label is an object, path inside it: label-name.key.subkey
          filter?: (req: any) => boolean; // allows to filter the requests before picking the values from them 
        ```
        "pick" can be a simple definition, or an array of definitions to pick from the request, where each 
        definition must be like:
        ```        
            export type PickFromRequestType = {
              body?: string[];
              query?: string[];
              headers?: string[];
              filter?: (req: any) => boolean; // allows to filter the requests before picking the values from them 
            };        
        ```
        Note that, in those definitions, the order of the elements in the object is really important, as the last element 
        defined will override the previous.
      
        ```
        Fex:
          request: [
            { // will pick the content-type from the header content-type, if it exists
              label: 'content-type',
              pick: { headers: ['content-type'] },
            },
            { // will create the label entity-id from the body::id if it exists
              // or from body::entity-id if body::id does not exist 
              // or from queryString::fallback-id if the previous two do not exist
              label: 'entity-id',
              pick: { query: ['fallback-id'], body: ['entity-id', 'id'] },
            },
            { // same as the previous one but if there is a queryString::override-id,
              // it will be taken over the others
              label: 'entity-id-2',
              pick: [{ query: ['fallback-id'], body: ['entity-id', 'id'] }, {query: 'override-id'}],
            },  
          ],
        ```
    
* logFieldNames?: {
    context: string;
    labels: string;
    trace: string;
  }: Can be used to override the logger output names of the context, labels and error trace fields


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

* Test if it's working with Stackdriver. If tracing is not working, we need to change 'logging.googleapis.com/trace' 
field to be 3 fields instead: trace, spanId and traceSampled 
(as defined [here](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry)).
To be able to do that, we only need to add the 3 fields in the context key and to define deep-labels for each one

## TODO

* Unit Tests
* Only tested with Express: try it on other platforms
* RegisterAsync to be able to use configService for logger configs
* Fix configuration warnings
