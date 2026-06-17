import {
  zEnvEnum,
  zEnvNonemptyTrimmed,
  zEnvOptionalTrimmed,
} from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  HOST_ENV: zEnvEnum,
  SOURCE_VERSION: zEnvOptionalTrimmed,
  VITE_BACKEND_TRPC_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
  VITE_WEBAPP_SENTRY_DSN: zEnvOptionalTrimmed,
  VITE_CLOUDINARY_CLOUD_NAME: zEnvOptionalTrimmed,
  VITE_MIXPANEL_API_KEY: zEnvOptionalTrimmed,
});

const envFromBackend = (window as any).webappEnvFromBackend;

export const env = zEnv.parse(
  // eslint-disable-next-line node/no-process-env
  envFromBackend?.replaceMeWithPublicEnv ? process.env : envFromBackend
);
