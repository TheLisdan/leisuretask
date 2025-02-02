import { trpc } from '../lib/trpc';
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0,-1).join('/')}';`) // Do not remove this comment
import { createTaskTrpcRoute } from './createTask';
import { getTasksTrpcRoute } from './getTasks';
// @endindex // This too

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  createTask: createTaskTrpcRoute,
  getTasks: getTasksTrpcRoute,
  // @endindex
});

export type TrpcRouter = typeof trpcRouter;
