import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '../../src/logger.module';

@Module({
  imports: [LoggerModule.forRoot({ name: 'example' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
