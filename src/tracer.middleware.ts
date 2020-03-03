import { Logger } from './logger.service';
import express = require('express');
require('@google-cloud/trace-agent').start();
const agent = require('@google-cloud/trace-agent').get();

/**
 * @param logger
 */
export const TracerMiddleware = (
  logger? : Logger
) => {
  return (req: express.Request, res: any, next: () => void) => {
    if(logger) {
      logger.setLabels({
        'logging.googleapis.com/trace':agent.getCurrentContextId ()
      });
      req.query['logger'] = logger;
    }
    next();
  };
};