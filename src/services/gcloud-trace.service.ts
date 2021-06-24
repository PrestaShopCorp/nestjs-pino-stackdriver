import { Logger, Injectable } from '@nestjs/common';
import {
  Config,
  PluginTypes,
  get as gcloudTracerGet,
  start as gcloudTracerStart,
} from '@google-cloud/trace-agent';
import { HEADER_GCLOUD_TRACE_CONTEXT } from '../constants';
import { RequestType } from '../types';

@Injectable()
export class GcloudTraceService {
  private readonly logger = new Logger(GcloudTraceService.name);
  static isActive: boolean = false;

  static start(config: Config = {}): PluginTypes.Tracer {
    this.isActive = true;
    return gcloudTracerStart({
      ...{
        logLevel:
          process.env.NODE_ENV === 'production'
            ? 1 // ERROR
            : 2, // WARN,
      },
      ...config,
    });
  }
  isActive() {
    return this.isActive;
  }
  get(): PluginTypes.Tracer {
    return gcloudTracerGet();
  }
  clean(): void {}
  async getTraceUrl() {
    const tracer = this.get();

    // calculate trace
    const context = tracer.getCurrentRootSpan().getTraceContext();
    if (!context) {
      // not tracing this request
      return '';
    }

    // calculate project
    let project;
    try {
      project = await tracer.getProjectId();
    } catch (e) {
      project = process.env.GCP_PROJECT_ID;
    }
    return `projects/${project}/traces/${context.traceId}`;
  }
  /**
   * @todo Use getTraceUrl instead (we need context to accept promise-like props)
   */
  getTraceUrlFromEnv() {
    // calculate trace
    const context = this.get()
      .getCurrentRootSpan()
      .getTraceContext();
    const project = process.env.GCP_PROJECT_ID;
    if (!context || !project) {
      // not tracing this request
      return '';
    }
    return `projects/${project}/traces/${context.traceId}`;
  }
  forceRequestToBeTraced(req: RequestType) {
    const tracer = this.get();
    const context = tracer.getCurrentRootSpan().getTraceContext();
    if (!context) {
      this.logger.warn(`Unable to find a trace context for the given request!`);
      this.logger.warn(req);
      return req;
    }
    const traceId = context.traceId;
    const spanId = context.spanId;

    req.headers[HEADER_GCLOUD_TRACE_CONTEXT] = `${traceId}/${spanId}/1`;

    return req;
  }
}
