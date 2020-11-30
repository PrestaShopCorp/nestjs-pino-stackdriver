# NestJs Context Module

Local context storage for NestJS

## About

This project includes: 

* A default context (key-value map) to store local information that can be used anywhere through your application, 
controllers and providers.
* A InjectContext decorator that allows declaring new context instances

## Basic Usage

* Include the module as an import into your module 
```typescript
import { Module, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextModule } from 'nesjs-context';
import { ExampleController } from './example2/src/example.controller';
import { ExampleHandler } from './example2/src/command/handler/example.handler';

@Module({
  imports: [CqrsModule, ContextModule.register()],
  controllers: [ExampleController],
  providers: [Logger, ExampleHandler],
})
export class ExampleModule {}
```

* Set a message: you can set a message from any middleware, controller, provider... 
```typescript
import { Controller, Get, Logger } from '@nestjs/common';
import { Context } from 'nesjs-context';

@Controller()
export class ExampleController {
  private logger: Logger = new Logger();
  constructor(
    private readonly defaultContext: Context,
  ) {}

  @Get('/')
  async doSomething() {
    this.defaultContext.set('example', 'default context message');
    tbis.logger.log(this.defaultContext.get('example');
  }
}
```

* Get a message: you can get a message that had been set before into a context in
any other middleware, controller, provider, commandHandler...
```typescript
import { Logger, Injectable } from '@nestjs/common';
import { Context } from 'nesjs-context';

@Injectable()
export class ExampleProvider  {
  private logger: Logger = new Logger();
  constructor(
    private readonly defaultContext: Context,
  ) {}

  async execute() {
    this.logger.log(
      `Command handler printing ${this.defaultContext.get('example')}`,
    );
  }
}
```

* Create a new context and set a message on it 
```typescript
import { Controller, Get } from '@nestjs/common';
import { Context, InjectContext } from 'nesjs-context';

@Controller()
export class ExampleController {
  private logger: Logger = new Logger();
  constructor(
    // Inject a custom context for your Context. 
    // You can inject the same instance of this context anywhere,
    // so to get a message you can repeat the previous example getValue 
    // but injecting this context instead of the default one
    @InjectContext('CONTROLLER_CONTEXT') 
    private readonly controllerContext: Context,
  ) {}

  @Get('/')
  async doSomething() {
    this.controllerContext.set('example', 'decorator context message');
    this.logger.log(this.controllerContext.get('example');
  }
}
```


## Advanced Usage

*  Set a message into the default context in the top-level of your application:

```typescript
  (...)
  const app = await NestFactory.create(ExampleModule, {
    logger: true,
  });

  const context = app.get(Context);
  context.set('test', 'value');

  await app.listen(3000);
```


## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nesjs-context/issues). 


## Ressources

* [contributors](https://github.com/PrestaShopCorp/nesjs-context/graphs/contributors)


## Examples 

There is a full working example in the directory "example" of this project ([here!](example2/)).

Use "yarn start" to execute the example script (from the "example" directory):
```
yarn install
yarn start
```

Now you can open another terminal and execute a curl to see the results of a GET:
```
curl --location --request GET 'http://127.0.0.1:9191/example/hello'
```

You will see a message printed (taken from the default context) and two logger::debug calls (one of them,
taken from a custom context).

## WIP


## TODO

* Unit Tests
* Only tested with Express: try it on other platforms
