import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { pickFromRequestTool } from '../../nestjs-ps-tools';
import { Context } from '../../nestjs-context';
import { CONTEXT_PINO_LOGGER_REQUEST } from './constants';
import { PinoContextConfig } from './pino-context.config';
import {
  LogFieldsConfigKeyOptionType,
  LogFieldsConfigPartRequestType,
  RequestFilterType,
} from './types';
import { hasConfiguration } from './type-guards';
import { set } from 'lodash';
import { LogFieldsConfigKey } from './enums';

@Injectable()
export class PinoContextRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly context: Context,
    private readonly config: PinoContextConfig,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    this.addContextRequestValues(request);
    return next.handle().pipe(
      tap(() =>
        // clear context value
        this.context.set(CONTEXT_PINO_LOGGER_REQUEST, {}),
      ),
    );
  }

  private addContextRequestValues(request: any) {
    for (const field of Object.values(LogFieldsConfigKey)) {
      if (hasConfiguration(this.config, [field, 'request'])) {
        this.config[field].request.forEach(requestFieldDef => {
          const { label, pick, filter = (req: any) => true } = requestFieldDef;
          this.addContextRequestValue(request, field, label, pick, filter);
        });
      }
    }
  }

  private addContextRequestValue(
    request: any,
    configFieldsKey: LogFieldsConfigKeyOptionType,
    label: string,
    pick: LogFieldsConfigPartRequestType['pick'],
    filter: RequestFilterType,
  ) {
    // you can filter the requests to avoid logging the labels
    if (!filter(request)) {
      return;
    }

    // for each picked value, override the previous value for the label
    Object.values(pickFromRequestTool(request, pick)).forEach(value => {
      const reqLabels = this.context.get(CONTEXT_PINO_LOGGER_REQUEST) || {};
      set(reqLabels, [configFieldsKey, label], value);
      this.context.set(CONTEXT_PINO_LOGGER_REQUEST, reqLabels);
    });
  }
}
