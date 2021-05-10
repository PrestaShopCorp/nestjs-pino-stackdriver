import { INestApplication } from '@nestjs/common';
import * as util from 'util';

export const isNestApplication = (app: any): app is INestApplication => {
  return util.types.isProxy(app) && typeof app.get === 'function';
};
