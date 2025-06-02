/* eslint-disable node/no-process-env */
import { z } from 'zod';
import { zEnvNonemptyTrimmed } from './zod';

const getSharedEnvVariable = (key: string) => {
  if (typeof window !== 'undefined') {
    const webappEnv = (window as any).webappEnvFromBackend || {};
    return (
      webappEnv[`VITE_${key}`] ||
      webappEnv[key] ||
      process.env[`VITE_${key}`] ||
      process.env[key]
    );
  }
  return process.env[`VITE_${key}`] || process.env[key];
};

const sharedEnvRaw = {
  CLOUDINARY_CLOUD_NAME: getSharedEnvVariable('CLOUDINARY_CLOUD_NAME'),
};

const zEnv = z.object({
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
});

export const sharedEnv = zEnv.parse(sharedEnvRaw);
