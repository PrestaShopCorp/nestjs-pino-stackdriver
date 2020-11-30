/**
 * @deprecated We keep it for cackwards compatibility
 */
import { PinoContextLogger } from './pino-context-logger.service';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends PinoContextLogger {}
