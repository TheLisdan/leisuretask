import { trpc } from '../lib/trpc';
// DO NOT REMOVE COMMENTS BELOW
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0,-1).join('/')}';`)
import { changePasswordTrpcRoute } from './auth/changePassword';
import { getMeTrpcRoute } from './auth/getMe';
import { signInTrpcRoute } from './auth/signIn';
import { signUpTrpcRoute } from './auth/signUp';
import { updateEmailTrpcRoute } from './auth/updateEmail';
import { updateUserNameTrpcRoute } from './auth/updateUserName';
import { getUserTrpcRoute } from './other/getUser';
import { createTaskTrpcRoute } from './tasks/createTask';
import { deleteTaskTrpcRoute } from './tasks/deleteTask';
import { getTasksTrpcRoute } from './tasks/getTasks';
import { orderTasksTrpcRoute } from './tasks/orderTasks';
import { setTaskStatusTrpcRoute } from './tasks/setTaskStatus';
import { updateTaskTrpcRoute } from './tasks/updateTask';
import { saveTimeTrpcRoute } from './timer/saveTime';
import { toggleTimerTrpcRoute } from './timer/toggleTimer';
// @endindex // This too

export const trpcRouter = trpc.router({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  changePassword: changePasswordTrpcRoute,
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updateEmail: updateEmailTrpcRoute,
  updateUserName: updateUserNameTrpcRoute,
  getUser: getUserTrpcRoute,
  createTask: createTaskTrpcRoute,
  deleteTask: deleteTaskTrpcRoute,
  getTasks: getTasksTrpcRoute,
  orderTasks: orderTasksTrpcRoute,
  setTaskStatus: setTaskStatusTrpcRoute,
  updateTask: updateTaskTrpcRoute,
  saveTime: saveTimeTrpcRoute,
  toggleTimer: toggleTimerTrpcRoute,
  // @endindex
});

export type TrpcRouter = typeof trpcRouter;
