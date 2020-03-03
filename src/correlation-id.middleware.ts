import { v4 as uuidv4 } from 'uuid';
import express = require('express');
import { Logger } from './logger.service';
const anyBase = require("any-base");

// Reduce uuid size
const flickrBase58 = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const toFlickr = anyBase('0123456789abcdef', flickrBase58);
const shorterUUID = () => {
  const longId = uuidv4().toLowerCase().replace(/-/g,'');
  return toFlickr(longId).substr(0, 8);
}
/**
 * @param logger
 * @param headerName
 * @param genFn a function that generates a suitable (random) correlation ID.
 * @see https://github.com/eropple/nestjs-correlation-id
 */
export const CorrelationIdMiddleware = (
  logger? : Logger,
  headerName = 'x-correlation-id',
  genFn: () => string = shorterUUID,
) => {
  return (req: express.Request, res: any, next: () => void) => {
    const correlationId = req.header(headerName) || genFn();
    // make sure this is lower-cased, otherwise downstream stuff will barf.
    req.headers[headerName] = correlationId;
    res.set(headerName, correlationId);
    if(logger) {
      logger.setLabels({
        correlation_id:  correlationId,
      });
      req.query['logger'] = logger;
    }
    next();
  };
};