import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PickFromRequestType } from '../types';
import { pickFromRequestTool } from '../tools';

export const buildDto = (
  include: PickFromRequestType = {
    body: true,
  },
  ctx: ExecutionContext,
) => {
  return pickFromRequestTool(ctx.switchToHttp().getRequest(), include);
};

export const BuildDto = createParamDecorator(buildDto);
