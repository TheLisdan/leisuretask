import { trpc } from '../lib/trpc';
import { getTasksTrpcRoute } from './getTasks';

export const trpcRouter = trpc.router({
  getTasks: getTasksTrpcRoute,
});

export type TrpcRouter = typeof trpcRouter;
