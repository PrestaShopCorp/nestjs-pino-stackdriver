type RequestIncludeType = string[] | boolean;

export type PickFromRequestItemType = {
  body?: RequestIncludeType;
  query?: RequestIncludeType;
  headers?: RequestIncludeType;
  params?: RequestIncludeType;
  filter?: (req: any) => boolean;
};
