# NestJs Correlation Id Module

Correlation-id tracing for Nestjs.

## About

It exports a middleware that adds a default x-correlation-id header to the request if it does not exist and copies the
x-correlation-id header into the response. 

Furthermore, the module uses ContextModule to store the x-correlation-id in the default context of your application,
allowing using three decorators to get the x-correlation-id value:

* @CorrelationId: Property decorator that adds the correlation-id to a class property
* @CorrelationIdMetadata: Class decorator that adds the property "correlation_id" to a "metadata" property inside the class
* @AddCorrelationId: Class decorator that sets the correlation-id into a given class property path

## Basic Usage

Include the module as an import into your main module:
```typescript
import { Module, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CorrelationIdModule } from 'nestjs-correlation-id';
import { ExampleController } from './examples/example-cqrs/src/example.controller';
import { ExampleHandler } from './examples/example-cqrs/src/command/handlers/example.handler';

@Module({
  imports: [CqrsModule, CorrelationIdModule.register()],
  controllers: [ExampleController],
  providers: [Logger, ExampleHandler],
})
export class ExampleModule {}
```

Now you can use any of the three correlation-id decorators to inject the x-corrrelation-id in your application. 
For example:

* As event metadata (note: this decorator converts your event.metadata into an accessor descriptor instead of data 
descriptor)
```typescript
import { CorrelationIdMetadata } from 'nestjs-correlation-id';

@CorrelationIdMetadata()
export class ExampleEvent {
  constructor(public readonly data: any, public readonly metadata: any) {}
}
```

* Into a class property (note: this decorator converts your object.property into an accessor descriptor instead of data 
descriptor)
```typescript
import { CorrelationId } from 'nestjs-correlation-id'; 

export class InternalServerErrorException {
  @CorrelationId()
  private readonly correlationId;
}
```

* Into a sub-property for a class property
```typescript
import { AddCorrelationId } from 'nestjs-correlation-id';

@AddCorrelationId('property.correlation_id')
export class ExampleClass {
  private readonly property = {}; // property.correlation_id will be added / overwritten 
}
```

Note that "x-correlation-id" will always be auto-generated if it does not exist as HEADER in the request.

## Set a custom correlation-id

You can use @SetCorrelationIdFrom decorator to set the correlation-id value from a method argument. 
This is very useful if you are not in a webapp context or you can not import the default middleware for any reason.

For example, if your app is a simple queue processor, you could add the job-id as correlation-id using something like:

```typescript
@Processor('my-queue')
export class ExampleProcessor {
  @CorrelationId()
  private correlationId: string;

  private readonly logger = new Logger(ExampleProcessor.name);

  @Process()
  @SetCorrelationIdFrom('id')
  handle(job: Job) {
    this.logger.log(`Correlation Id ${this.correlationId} has taken the value of the jobId (${job.id})`);
  }
}
```

Of course, you could also use the default context from ContextModule to set the correlation-id value:

```typescript
import { Context } from 'nestjs-context';
import { CONTEXT_CORRELATION_ID } from 'nestjs-correlation-id';

@Injectable()
export class ExampleClass {
  @CorrelationId()
  private correlationId: string;
  
  constructor(private readonly context: Context) {
    this.context.set(CONTEXT_CORRELATION_ID, 'my-custom-value-for-correlation-id');
  }
}
```

## Advanced Usage

You may want to use the correlation-id middleware to generate a random correlation-id header (by default) without
importing the correlation-id module, as you do not need to use any of the correlation-id decorators.

You can do it as explained in the [official documentation](https://docs.nestjs.com/middleware). 
For example, you can add it globally:

```typescript
    import { correlationIdMiddleware, CorrelationIdConfig } from 'nestjs-correlation-id';
    (...)

    const app = await NestFactory.create(AppModule);
    app.use(correlationIdMiddleware(CorrelationIdConfig));
    await app.listen(3000);
```

## Further Configuration

Correlation id module can be configured passing to its "register" method an object with one or more of the 
following properties:

* headerName?: string = "x-correlation-id";

    Header name to be use while registering the correlation id in request.headers.
    If correlation id header is undefined in request.headers, it will be generated with
    a random "idGenerator". 

* idGenerator?: () => string;

   This option allows to override the default function to generate random the correlationId header 
   (if it does not exist in the request)



## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nestjs-correlation-id/issues). 


## Ressources

* [contributors](https://github.com/PrestaShopCorp/nestjs-correlation-id/graphs/contributors)


## Examples 

There is a full working example in the directory "example" of this project ([here!](examples/)).

Use "yarn start" to execute the example script (from the "example" directory):
```
yarn install
yarn start
```

Now you can open another terminal and execute a curl to see the results of a POST:
```
curl --location --request POST 'http://127.0.0.1:9191/example?id=notused' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "shop-id"
}'
```

You can try adding and removing the header "x-correlation-id" to see the effects into the resulting response.

## WIP


## TODO

* Unit Tests
* Only tested with Express: try it on other platforms
