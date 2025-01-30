import cors from 'cors';
import express from 'express';
import { applyExpressMiddleware } from './lib/trpc';
import { trpcRouter } from './router';

const expressApp = express();
const port = 3000;

expressApp.use(cors());

expressApp.get('/ping', (req, res) => {
  res.send('pong');
});

applyExpressMiddleware(expressApp, trpcRouter);

expressApp.listen(port, () => {
  console.info('Listening on http://localhost:' + port);
});
