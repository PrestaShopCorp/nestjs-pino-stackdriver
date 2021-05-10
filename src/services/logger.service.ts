import { Injectable, Scope } from '@nestjs/common';
import { PinoContextLogger } from './pino-context-logger.service';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends PinoContextLogger {}
