import { Module, Global } from '@nestjs/common';
import { GcloudTraceService } from './services';

@Global()
@Module({
  providers: [GcloudTraceService],
  exports: [GcloudTraceService],
})
export class GcloudTraceModule {}
