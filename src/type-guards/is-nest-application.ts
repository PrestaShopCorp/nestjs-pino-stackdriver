import * as util from 'util';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';

export const isNestApplication = (app: any): app is INestApplicationContext => {
  return util.types.isProxy(app) && typeof app.get === 'function';
};
