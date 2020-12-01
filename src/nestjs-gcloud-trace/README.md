# NestJs Gcloud Tracer Module

Gcloud tracer integration for Nestjs


## About

It adds a header 'x-gcloud-trace-context-id' to add the trace-id into the request and the response.

It uses internally [nest-context](https://github.com/PrestaShopCorp/nestjs-context) to store the trace url for the 
current gcloud project and trace-id. The url (something like "projects/<project-id>/traces/<trace-id>") would be 
stored in the default context.

Futhermore, it allows to:

* Get the cloud trace agent anywhere in your code as a DI (see GcloudTracerService)
* Force requests to be traced (using a middleware that sets the "x-cloud-trace-context" header)

## Basic Usage

Include the module as an import into your main module:

```typescript
import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GcloudTraceModule } from 'nestjs-gcloud-trace';
import { ExampleController } from './example.controller';

@Module({
  imports: [ConfigModule.forRoot(), GcloudTraceModule],
  controllers: [ExampleController],
  providers: [Logger],
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

## Advanced Usage

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
The first parameter to build that middleware is the GcloudTraceService provider and the second is a function 
to filter the requests, which receives the request as first argument and the response as second and must return 
a boolean.


## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nestjs-correlation-id/issues). 


## Ressources

* [contributors](https://github.com/PrestaShopCorp/nestjs-correlation-id/graphs/contributors)
* [nest-context](https://github.com/PrestaShopCorp/nestjs-context)
* [gcloud-trace](https://cloud.google.com/trace/docs/setup)
* [gcloud-trace for node](https://cloud.google.com/trace/docs/setup/nodejs)
* [gcloud-openapi tracing](https://cloud.google.com/endpoints/docs/openapi/tracing)
* [gcloud-logging structured (log format to log tracing)](https://cloud.google.com/run/docs/logging#writing_structured_logs)

## Examples 

There is a full working example in the directory "example" of this project ([here!](example/)).

Use "yarn start" to execute the example script (from the "example" directory):
```
yarn install
yarn start
```

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


## TODO

* Unit Tests
* Only tested with Express: try it on other platforms
