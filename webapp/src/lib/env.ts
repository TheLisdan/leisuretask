import {
  zEnvEnum,
  zEnvNonemptyTrimmed,
  zEnvNonemptyTrimmedRequiredOnNotLocal,
} from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  HOST_ENV: zEnvEnum,
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
});

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env);
