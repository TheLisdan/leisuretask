import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { type Express } from 'express';
import superjson from 'superjson';
import { expressHandler } from 'trpc-playground/handlers/express';
import { type TrpcRouter } from '../router';
import { ExpressRequest } from '../utils/types';
import { AppContext } from './ctx';
import { ExpectedError } from './error';
import { logger } from './logger';

export const getTrpcContext = ({
  appContext,
  req,
}: {
  appContext: AppContext;
  req: ExpressRequest;
}) => ({
  ...appContext,
  me: req.user || null,
});

const getCreateTrpcContext =
  (appContext: AppContext) =>
  ({ req }: trpcExpress.CreateExpressContextOptions) =>
    getTrpcContext({ appContext, req: req as ExpressRequest });

type TrpcContext = inferAsyncReturnType<
  ReturnType<typeof getCreateTrpcContext>
>;

const trpc = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    const isExpected = error.cause instanceof ExpectedError;
    return {
      ...shape,
      data: {
        ...shape.data,
        isExpected,
      },
    };
  },
});

export const createTRPCRouter = trpc.router;

export const trpcLoggedProcedure = trpc.procedure.use(
  trpc.middleware(async ({ path, type, next, ctx, rawInput }) => {
    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;
    const meta = {
      path,
      type,
      userId: ctx.me?.id || null,
      durationMs,
      rawInput: rawInput || null,
    };
    if (result.ok) {
      logger.info({
        logType: `trpc:${type}${path === 'saveTime' ? ':saveTime' : ''}:success`,
        message: 'Successful request',
        meta: { ...meta, output: result.data },
      });
    } else {
      logger.error({
        logType: `trpc:${type}:error`,
        error: result.error,
        meta: meta,
      });
    }
    return result;
  })
);

export const applyExpressMiddleware = async (
  expressApp: Express,
  appContext: AppContext,
  trpcRouter: TrpcRouter
) => {
  expressApp.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcRouter,
      createContext: getCreateTrpcContext(appContext),
    })
  );

  expressApp.use(
    '/trpc-playground',
    await expressHandler({
      trpcApiEndpoint: '/trpc',
      playgroundEndpoint: '/trpc-playground',
      router: trpcRouter,
      request: {
        superjson: true,
      },
    })
  );
};
