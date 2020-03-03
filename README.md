
# NestJS Stackdriver
## Using the logger
Configured to be stackdriver compliant.

### Using as default logger
```typescript
import { Logger } from 'nestjs-pino-stackdriver';
// In your main JS
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  await app.listen(3000);
}
bootstrap();
```

### Using inside the app
#### Import it in your module 
Configure it using pino options  https://github.com/pinojs/pino/blob/master/docs/api.md
```typescript
import { LoggerModule } from 'nestjs-pino-stackdriver';
@Module({
  // You can leave config empty
  imports: [LoggerModule.forRoot({ name: 'example' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
```
#### Inject it from everywhere
```typescript
import { Controller, Get, Logger } from '@nestjs/common';
@Controller()
export class AppController {
  constructor(
    private readonly logger: Logger,
  ) {
    this.logger.log('app controller booted');
  }

  @Get()
  getHello(): string {
    this.logger.log(headers);
    return 'hello';
  }
}
```

## Correlation ID
Add in your request a correlation id if none provided

```typescript
import { CorrelationIdMiddleware } from 'nestjs-pino-stackdriver';
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.use(CorrelationIdMiddleware(logger));
  await app.listen(3000);
}
bootstrap();
```

## Tracer
Add tracer info in your log

```typescript
import { TracerMiddleware } from 'nestjs-pino-stackdriver';
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.use(TracerMiddleware(logger))
  await app.listen(3000);
}
bootstrap();
```

## Use log with trace and correlation id
```typescript
import { Controller, Get, Headers, , Query } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(@Headers() headers, @Query('logger') logger): string {
    // console.log(logger);
    logger.log('request received', 'app.getHello', headers);
    return this.appService.getHello();
  }
}
```

Output in production
```json
 {"severity":"info","correlation_id":"4NTtNp4X","logging.googleapis.com/trace":"281fe620078d4562b311712cf42faefd","context":"app.getHello","message":"request received {\"host\":\"localhost:3000\",\"user-agent\":\"curl/7.64.1\",\"accept\":\"*/*\",\"x-correlation-id\":\"4NTtNp4X\"}","v":1}
```
Or locally
```
[2020-03-03 19:24:00.673 +0000] INFO : request received {"host":"localhost:3000","user-agent":"curl/7.64.1","accept":"*/*","x-correlation-id":"51eLtfXz"}
       correlation_id: "51eLtfXz"
       logging.googleapis.com/trace: "9b25e09ac8be4e0c93ba40304bf80fe8"
       context: "app.getHello"
```