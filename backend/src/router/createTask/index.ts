import { z } from 'zod';
import { tasks } from '../../lib/tasks';
import { trpc } from '../../lib/trpc';

export const createTaskTrpcRoute = trpc.procedure
  .input(
    z.object({
      taskname: z
        .string()
        .min(1, 'Enter task text')
        .max(100, 'Task text is too long'),
    })
  )
  .mutation(({ input }) => {
    tasks.push({
      id: tasks.length + 1,
      taskname: input.taskname,
      completed: false,
    });
    return true;
  });
