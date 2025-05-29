import { env } from './lib/env';
import cors from 'cors';
import express from 'express';
import { applyCron } from './lib/cron';
import { AppContext, createAppContext } from './lib/ctx';
import { logger } from './lib/logger';
import { applyPasswordToExpressApp } from './lib/password';
import { initSentry } from './lib/sentry';
import { applyServeWebApp } from './lib/serveWebApp';
import { applyExpressMiddleware } from './lib/trpc';
import { trpcRouter } from './router';

void (async () => {
  let ctx: AppContext | null = null;
  try {
    initSentry();
    ctx = createAppContext();
    const expressApp = express();

    expressApp.use(cors());

    expressApp.get('/ping', (req, res) => {
      res.send('pong');
    });

    applyPasswordToExpressApp(expressApp, ctx);
    await applyExpressMiddleware(expressApp, ctx, trpcRouter);
    await applyServeWebApp(expressApp);
    applyCron(ctx);

    expressApp.use(
      (
        error: unknown,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        logger.error({ logType: 'express', error: error });
        if (res.headersSent) {
          next(error);
          return;
        }
        res.status(500).send('Internal server error');
      }
    );

    expressApp.listen(env.PORT, () => {
      logger.info({
        logType: 'express',
        message: `Listening on http://localhost:${env.PORT}`,
      });
    });
  } catch (error) {
    logger.error({ logType: 'app', error: error });
    await ctx?.stop();
  }
})();
