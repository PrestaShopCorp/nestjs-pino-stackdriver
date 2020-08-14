import { v4 as uuidv4 } from 'uuid';
import { Logger } from './logger.service';
import { INestApplication } from '@nestjs/common';
import { Tracer } from '@google-cloud/trace-agent/build/src/plugin-types';
import express = require('express');

const anyBase = require('any-base');

// Reduce uuid size
const flickrBase58 = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const toFlickr = anyBase('0123456789abcdef', flickrBase58);

const shortIdGenerator = () => {
  const longId = uuidv4().toLowerCase().replace(/-/g, '');
  return toFlickr(longId);
};

export type CorrelationTracerConfig = {
  header_name?: string,
  id_generator?: () => string,
  app?: INestApplication,
  agent?: Tracer
}

/**
 * @see https://github.com/eropple/nestjs-correlation-id
 */
export const CorrelationTracerMiddleware: (config?: CorrelationTracerConfig) => (req: express.Request, res: any, next: () => void) => Promise<void> = (config: CorrelationTracerConfig = {}) => {
  const headerName = config.header_name || 'x-correlation-id';
  const idGenerator = config.id_generator || shortIdGenerator;

  return async (req: express.Request, res: any, next: () => void) => {
    const correlationId = req.header(headerName) || idGenerator();
    // make sure this is lower-cased, otherwise downstream stuff will barf.
    req.headers[headerName] = correlationId;
    res.set(headerName, correlationId);

    // Build one logger every query
    if (config.app) {
      const logger = await config.app.resolve(Logger);
      let labels;
      labels = {
        correlation_id: correlationId,
      }
      if (config.agent) {
        const contextId = config.agent.getCurrentContextId();
        if(contextId) {
          labels = {
            correlation_id: correlationId,
            'logging.googleapis.com/trace': require('@google-cloud/trace-agent').get().getCurrentContextId(),
          };
        }
      }
      logger.setLabels(labels);
      req.query['logger'] = logger;
    }
    next();
  };
};
