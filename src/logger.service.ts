import { Injectable, Scope } from '@nestjs/common';
import { PinoContextLogger } from './nestjs-pino-context';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends PinoContextLogger {}
