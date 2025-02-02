import { tasks } from '../../lib/tasks';
import { trpc } from '../../lib/trpc';
import { zCreateTaskTrpcInput } from './input';

export const x123 = 123;
export const createTaskTrpcRoute = trpc.procedure
  .input(zCreateTaskTrpcInput)
  .mutation(({ input }) => {
    tasks.push({
      id: tasks.length + 1,
      taskname: input.taskname,
      completed: false,
    });
    return true;
  });
