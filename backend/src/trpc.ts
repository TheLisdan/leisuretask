import { initTRPC } from '@trpc/server';

const tasks = [
  { id: 1, name: 'Be cool' },
  { id: 2, name: 'Write an app' },
  { id: 3, name: 'Profit' },
];

const trpc = initTRPC.create();

export const trpcRouter = trpc.router({
  getTasks: trpc.procedure.query(() => {
    return { tasks };
  }),
});

export type TrpcRouter = typeof trpcRouter;
