import { zEnvEnum, zEnvOptionalTrimmed } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zEnv = z
  .object({
    NODE_ENV: z.enum(['development', 'production']),
    HOST_ENV: zEnvEnum,
    VITE_APP_MODE: z.enum(['demo', 'fullstack']).default('fullstack'),
    VITE_BACKEND_TRPC_URL: zEnvOptionalTrimmed,
    VITE_WEBAPP_URL: zEnvOptionalTrimmed,
    SOURCE_VERSION: zEnvOptionalTrimmed,
    VITE_WEBAPP_SENTRY_DSN: zEnvOptionalTrimmed,
    VITE_CLOUDINARY_CLOUD_NAME: zEnvOptionalTrimmed,
    VITE_MIXPANEL_API_KEY: zEnvOptionalTrimmed,
  })
  .superRefine((value, ctx) => {
    if (value.VITE_APP_MODE === 'fullstack' && !value.VITE_BACKEND_TRPC_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['VITE_BACKEND_TRPC_URL'],
        message: 'Required when VITE_APP_MODE=fullstack',
      });
    }
  });

const envFromBackend = (window as any).webappEnvFromBackend;
// eslint-disable-next-line no-restricted-syntax
const viteEnv = import.meta.env;
const runtimeEnv = envFromBackend?.replaceMeWithPublicEnv
  ? viteEnv
  : (envFromBackend ?? viteEnv);

export const env = zEnv.parse({
  NODE_ENV: viteEnv.DEV ? 'development' : 'production',
  HOST_ENV: viteEnv.VITE_HOST_ENV ?? viteEnv.HOST_ENV ?? 'local',
  VITE_APP_MODE: viteEnv.VITE_APP_MODE ?? 'fullstack',
  ...runtimeEnv,
});
