import { initTRPC } from '@trpc/server';
import _ from 'lodash';

const tasks = _.times(5, (i) => ({
  id: i + 1,
  name: `Task ${i + 1}`,
}));

const trpc = initTRPC.create();

export const trpcRouter = trpc.router({
  getTasks: trpc.procedure.query(() => {
    return { tasks };
  }),
});

export type TrpcRouter = typeof trpcRouter;
