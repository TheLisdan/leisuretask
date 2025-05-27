import { EOL } from 'os';
import { omit } from '@leisuretask/shared/src/omit';
import { TRPCError } from '@trpc/server';
import debug from 'debug';
import _ from 'lodash';
import pc from 'picocolors';
import { serializeError } from 'serialize-error';
import { MESSAGE } from 'triple-beam';
import winston from 'winston';
import * as yaml from 'yaml';
import { deepMap } from '../utils/deepMap';
import { env } from './env';
import { ExpectedError } from './error';
import { sentryCaptureException } from './sentry';

export const winstonLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
  transports: [
    new winston.transports.Console({
      format:
        env.HOST_ENV !== 'local'
          ? winston.format.json()
          : winston.format((logData) => {
              const setColor = {
                info: (str: string) => pc.blue(str),
                error: (str: string) => pc.red(str),
                debug: (str: string) => pc.cyan(str),
              }[logData.level as 'info' | 'error' | 'debug'];
              const levelAndType = `${logData.level} ${logData.logType}`;
              const topMessage = `${setColor(levelAndType)} ${pc.green(String(logData.timestamp))}${EOL}${logData.message}`;

              const visibleMessageTags = omit(logData, [
                'level',
                'logType',
                'timestamp',
                'message',
                'service',
                'hostEnv',
              ]);

              const stringifyedLogData = _.trim(
                yaml.stringify(visibleMessageTags, (_k, v) =>
                  _.isFunction(v) ? 'Function' : v
                )
              );

              const resultLogData = {
                ...logData,
                [MESSAGE]:
                  [
                    topMessage,
                    Object.keys(visibleMessageTags).length > 0
                      ? `${EOL}${stringifyedLogData}`
                      : '',
                  ]
                    .filter(Boolean)
                    .join('') + EOL,
              };

              return resultLogData;
            })(),
    }),
  ],
});

export type LoggerMetaData = Record<string, any> | undefined;
const prettifyMeta = (meta: LoggerMetaData): LoggerMetaData => {
  return deepMap(meta, ({ key, value }) => {
    if (
      [
        'email',
        'password',
        'newPassword',
        'oldPassword',
        'token',
        'text',
        'description',
        'apiKey',
        'signature',
      ].includes(key)
    ) {
      return '🙈';
    }
    return value;
  });
};

export const logger = {
  info: (props: {
    logType: string;
    message: string;
    meta?: LoggerMetaData;
  }) => {
    if (!debug.enabled(`leisuretask:${props.logType}`)) {
      return;
    }
    winstonLogger.info(props.message, {
      logType: props.logType,
      ...prettifyMeta(props.meta),
    });
  },
  error: (props: { logType: string; error: any; meta?: LoggerMetaData }) => {
    const isNativeExpectedError = props.error instanceof ExpectedError;
    const isTrpcExpectedError =
      props.error instanceof TRPCError &&
      props.error.cause instanceof ExpectedError;
    const prettifiedMetaData = prettifyMeta(props.meta);
    if (!isNativeExpectedError && !isTrpcExpectedError) {
      sentryCaptureException(props.error, prettifiedMetaData);
    }
    if (!debug.enabled(`leisuretask:${props.logType}`)) {
      return;
    }
    const serializedError = serializeError(props.error);
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType: props.logType,
      error: props.error,
      errorStack: serializedError.stack,
      ...prettifiedMetaData,
    });
  },
};
