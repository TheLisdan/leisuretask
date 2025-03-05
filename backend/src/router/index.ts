import { trpc } from '../lib/trpc';
// DO NOT REMOVE COMMENTS BELOW
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0,-1).join('/')}';`)
import { createTaskTrpcRoute } from './createTask';
import { deleteTaskTrpcRoute } from './deleteTask';
import { getMeTrpcRoute } from './getMe';
import { getTasksTrpcRoute } from './getTasks';
import { signInTrpcRoute } from './signIn';
import { signUpTrpcRoute } from './signUp';
import { updateTaskTrpcRoute } from './updateTask';
// @endindex // This too

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  createTask: createTaskTrpcRoute,
  deleteTask: deleteTaskTrpcRoute,
  getMe: getMeTrpcRoute,
  getTasks: getTasksTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updateTask: updateTaskTrpcRoute,
  // @endindex
});

export type TrpcRouter = typeof trpcRouter;
