import { isArray, pick } from 'lodash';
import { PickFromRequestType } from '../types';

export const pickFromRequestTool = (
  request: any,
  pickFromRequest: PickFromRequestType,
) => {
  let dto = {};
  (isArray(pickFromRequest) ? pickFromRequest : [pickFromRequest]).forEach(
    pickDesc => {
      const { filter = () => true, ...pickFrom } = pickDesc;
      if (!filter(request)) {
        return;
      }
      Object.entries(pickFrom).forEach(([requestPart, include]) => {
        if (typeof include === 'boolean' && include === true) {
          dto = { ...dto, ...request[requestPart] };
        } else if (typeof include === 'object') {
          dto = { ...dto, ...pick(request[requestPart], include) };
        }
      });
    },
  );
  return dto;
};
