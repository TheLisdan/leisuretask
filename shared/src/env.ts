import { z } from 'zod';
import { zEnvNonemptyTrimmed } from './zod';

/* eslint-disable node/no-process-env */
const sharedEnvRaw = {
  CLOUDINARY_CLOUD_NAME:
    process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
};

const zEnv = z.object({
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
});

export const sharedEnv = zEnv.parse(sharedEnvRaw);
