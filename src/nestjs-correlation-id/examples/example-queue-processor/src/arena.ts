import { EXAMPLE_QUEUE } from './constants';
import * as App from 'express';

const Arena = require('bull-arena');

// Mandatory import of queue library.
const Bull = require('bull');

const arenaConfig = Arena(
  {
    Bull,
    queues: [
      {
        name: EXAMPLE_QUEUE,
        hostId: 'localhost',
      },
    ],
  },
  {
    basePath: '/arena',
  },
);

const app = App();
// Make arena's resources (js/css deps) available at the base app route
app.use('/', arenaConfig);
