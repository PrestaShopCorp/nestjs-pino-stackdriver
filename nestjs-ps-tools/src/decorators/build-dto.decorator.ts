import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PickFromRequestType } from '../types';
import { pickFromRequestTool } from '../tools';

export const BuildDto: (
  include?: PickFromRequestType,
) => ParameterDecorator = createParamDecorator(
  (
    include: PickFromRequestType = {
      body: true,
    },
    ctx: ExecutionContext,
  ) => pickFromRequestTool(ctx.switchToHttp().getRequest(), include),
);
