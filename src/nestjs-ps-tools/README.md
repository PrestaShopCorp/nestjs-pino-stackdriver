# NestJs Prestashop Tools

Some tools related to Nestjs

## About

This package includes:

* @BuildDto: Param decorator that allows to build a dto from Request::body, Request::query and Request::headers, allowing
to filter their properties to build the dto

## Usage

### BuildDto

Use the BuildDto decorator to facilitate the creation of your CQRS commands or your DTOs:

```typescript
  import { Controller, Post } from '@nestjs/common';
  import { CommandBus } from '@nestjs/cqrs';
  import { BuildDto } from 'nestjs-ps-tools';
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
      body: true,
      // Note that we recommend to whitelist the properties:
      // body: Object.getOwnPropertyNames(new ExampleCommand()),
      headers: ['x-correlation-id'],
    })
    command: ExampleCommand,
  ) {
    return this.commandBus.execute(command);    
  }
```

BuildDto receives a configuration object (PickFromRequestType) determining which attributes of the request
shall be used to build the dto and in which order, so you can pass either a list of properties for each query,
body and headers to be taken into account, or a boolean indicating whether that part of the request must
be ignored (false) or fully included (true).

So, for example, in the previous example, "query: false" means that the query string will be ignored to 
build the command, "body: true" means that the received body will be fully imported into the dto and 
"headers: ['x-correlation-id']" means that only the "x-correlation-id" header will be set into the command class.

It's important to notice that the order of the BuildDto data is really important: in the previous example if "query" was
set to "true", and if we had posted an "id=xxx" query-string, and an {"id":"yyy"} body, command.id would be set to "yyy".

Anyhow, we DO NOT recommend using "true", whenever you can you should be using a whitelist of values instead.

If you use BuildDto() without any parameters, it will call the decorator with { body: true }


## Advanced Usage

TODO 


## Reporting issues

Create an [issue](https://github.com/PrestaShopCorp/nestjs-ps-tools/issues). 


## Ressources

* [contributors](https://github.com/PrestaShopCorp/nestjs-ps-tools/graphs/contributors)
