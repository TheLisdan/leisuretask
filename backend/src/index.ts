import cors from 'cors';
import express from 'express';
import { AppContext, createAppContext } from './lib/ctx';
import { sendWelcomeEmail } from './lib/emails';
import { env } from './lib/env';
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

    expressApp.listen(env.PORT, () => {
      console.info('Listening on http://localhost:' + env.PORT);
    });

    void sendWelcomeEmail({
      user: { email: `${Math.random()}@example.com`, name: 'John Doe' },
    });
  } catch (error) {
    console.error(error);
    await ctx?.stop();
  }
})();
