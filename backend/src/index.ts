import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { AppContext, createAppContext } from './lib/ctx';
import { applyExpressMiddleware } from './lib/trpc';
import { trpcRouter } from './router';

dotenv.config();

void (async () => {
  let ctx: AppContext | null = null;
  try {
    ctx = createAppContext();
    const expressApp = express();
    const port = 3000;

    expressApp.use(cors());

    expressApp.get('/ping', (req, res) => {
      res.send('pong');
    });

    await applyExpressMiddleware(expressApp, ctx, trpcRouter);

    expressApp.listen(port, () => {
      console.info('Listening on http://localhost:' + port);
    });
  } catch (error) {
    console.error(error);
    await ctx?.stop();
  }
})();
