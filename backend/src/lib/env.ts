/* eslint-disable node/no-process-env */
import fs from 'fs';
import path from 'path';
import {
  zEnvEnum,
  zEnvNonemptyTrimmed,
  zEnvNonemptyTrimmedRequiredOnNotLocal,
} from '@leisuretask/shared/src/zod';
import * as dotenv from 'dotenv';
import { z } from 'zod';

const findEnvFilePath = (dir: string): string | null => {
  const maybeEnvFilePath = path.join(dir, '.env');
  if (fs.existsSync(maybeEnvFilePath)) {
    return maybeEnvFilePath;
  }
  if (dir === '/') {
    return null;
  }
  return findEnvFilePath(path.dirname(dir));
};
const envFilePath = findEnvFilePath(__dirname);

if (envFilePath) {
  dotenv.config({ path: envFilePath, override: true });
  dotenv.config({
    path: `${envFilePath}.${process.env.NODE_ENV}`,
    override: true,
  });
}

const zEnv = z.object({
  PORT: zEnvNonemptyTrimmed,
  HOST_ENV: zEnvEnum,
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: zEnvNonemptyTrimmed.refine((val) => {
    if (process.env.NODE_ENV !== 'test') {
      return true;
    }
    const [databaseUrl] = val.split('?');
    const [databaseName] = databaseUrl.split('/').reverse();
    return databaseName.endsWith('-test');
  }, 'Database name must end with -test on test environment'),
  JWT_SECRET: zEnvNonemptyTrimmed,
  PASSWORD_SALT: zEnvNonemptyTrimmed,
  WEBAPP_URL: zEnvNonemptyTrimmed,
  BREVO_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  FROM_EMAIL_NAME: zEnvNonemptyTrimmed,
  FROM_EMAIL_ADDRESS: zEnvNonemptyTrimmed,
  DEBUG: z
    .string()
    .optional()
    .refine(
      (val) =>
        process.env.HOST_ENV === 'local' ||
        process.env.NODE_ENV !== 'production' ||
        (!!val && val.length > 0),
      'Required on not local host or production'
    ),
  BACKEND_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
  SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  CLOUDINARY_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_SECRET: zEnvNonemptyTrimmedRequiredOnNotLocal,
});

export const env = zEnv.parse(process.env);
