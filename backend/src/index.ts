import cors from 'cors';
import express from 'express';
import { applyCron } from './lib/cron';
import { AppContext, createAppContext } from './lib/ctx';
import { env } from './lib/env';
import { logger } from './lib/logger';
import { applyPasswordToExpressApp } from './lib/password';
import { applyExpressMiddleware } from './lib/trpc';
import { trpcRouter } from './router';

void (async () => {
  let ctx: AppContext | null = null;
  try {
    ctx = createAppContext();
    const expressApp = express();

    expressApp.use(cors());

    expressApp.get('/ping', (req, res) => {
      res.send('pong');
    });

    applyPasswordToExpressApp(expressApp, ctx);
    await applyExpressMiddleware(expressApp, ctx, trpcRouter);
    applyCron(ctx);

    expressApp.listen(env.PORT, () => {
      logger.info('Listening on http://localhost:' + env.PORT);
    });
  } catch (error) {
    logger.error(error);
    await ctx?.stop();
  }
})();
