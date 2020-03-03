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

  @Get()
  getHello(@Headers() headers, @Query('logger') logger): string {
    // console.log(logger);
    logger.log('Youpi request received', 'app.getHello', headers);
    return this.appService.getHello();
  }
}
