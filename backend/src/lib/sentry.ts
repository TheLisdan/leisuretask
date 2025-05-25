import path from 'path';
import * as Sentry from '@sentry/node';
import { env } from './env';
import { LoggerMetaData } from './logger';

const isSentryEnabled = env.BACKEND_SENTRY_DSN;

export const initSentry = () => {
  if (isSentryEnabled) {
    Sentry.init({
      dsn: env.BACKEND_SENTRY_DSN,
      environment: env.HOST_ENV,
      release: env.SOURCE_VERSION,
      normalizeDepth: 10,
      integrations: [
        Sentry.rewriteFramesIntegration({
          root: path.resolve(__dirname, '../../'),
        }),
      ],
    });
  }
};
export const sentryCaptureException = (
  error: Error,
  prettifiedMetaData?: LoggerMetaData
) => {
  if (isSentryEnabled) {
    Sentry.captureException(error, prettifiedMetaData);
  }
};
