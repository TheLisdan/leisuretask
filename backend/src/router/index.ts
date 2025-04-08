import { trpc } from '../lib/trpc';
// DO NOT REMOVE COMMENTS BELOW
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0,-1).join('/')}';`)
import { getMeTrpcRoute } from './auth/getMe';
import { signInTrpcRoute } from './auth/signIn';
import { signUpTrpcRoute } from './auth/signUp';
import { updateProfileTrpcRoute } from './auth/updateProfile';
import { getUserTrpcRoute } from './other/getUser';
import { createTaskTrpcRoute } from './tasks/createTask';
import { deleteTaskTrpcRoute } from './tasks/deleteTask';
import { getTasksTrpcRoute } from './tasks/getTasks';
import { orderTasksTrpcRoute } from './tasks/orderTasks';
import { updateTaskTrpcRoute } from './tasks/updateTask';
// @endindex // This too

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  getUser: getUserTrpcRoute,
  createTask: createTaskTrpcRoute,
  deleteTask: deleteTaskTrpcRoute,
  getTasks: getTasksTrpcRoute,
  orderTasks: orderTasksTrpcRoute,
  updateTask: updateTaskTrpcRoute,
  // @endindex
});

export type TrpcRouter = typeof trpcRouter;
