import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import { trpcRouter } from './trpc';

const expressApp = express();
const port = 3000;

expressApp.use(cors());

expressApp.get('/ping', (req, res) => {
  res.send('pong');
});

expressApp.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
  })
);

expressApp.listen(port, () => {
  console.info('Listening on http://localhost:' + port);
});
