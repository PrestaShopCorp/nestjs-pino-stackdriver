import { Controller, Get, Headers, Inject, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from '../../src';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger,
  ) {
    this.logger.log('app controller booted');
  }

  @Get('/hello')
  getHello(@Headers() headers, @Query('logger') logger): string {
    logger.log('Hello request received', 'app.getHello', headers);
    return this.appService.getHello();
  }
  @Get('/hi')
  getHi(@Headers() headers, @Query('logger') logger): string {
    logger.log('Hi request received', 'app.getHi', headers);
    return "Hi"
  }
}
