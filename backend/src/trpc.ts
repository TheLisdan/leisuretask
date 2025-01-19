import { TaskType } from '@leisuretask/shared/src/types/task';
import { initTRPC } from '@trpc/server';
import _ from 'lodash';

const tasks: TaskType[] = _.times(5, (i) => ({
  id: i + 1,
  name: `Task ${i + 1}`,
  completed: false,
}));

const trpc = initTRPC.create();

export const trpcRouter = trpc.router({
  getTasks: trpc.procedure.query(() => {
    return { tasks };
  }),
});

export type TrpcRouter = typeof trpcRouter;
