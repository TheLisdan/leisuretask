import { z } from 'zod';
import { zEnvNonemptyTrimmed } from '../../../shared/src/zod';

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
});

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env);
