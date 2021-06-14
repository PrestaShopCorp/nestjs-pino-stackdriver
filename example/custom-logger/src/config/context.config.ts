import { ContextName, ContextConfigType } from 'nestjs-context';

export const contextConfig = {
  cached: true,
  global: true,
  addDefaults: true,
  type: ContextName.HTTP,
  build: {
    host: ['req.headers.host'],
    node_env: [process.env.NODE_ENV],
    id: [(req: any) => req.body.id],
  },
  correlation_id: { generator: true },
} as ContextConfigType;
