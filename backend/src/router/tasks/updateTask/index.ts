import { trpc } from '../../../lib/trpc';
import { zUpdateTaskTrpcInput } from './input';

export const updateTaskTrpcRoute = trpc.procedure
  .input(zUpdateTaskTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { taskId, ...taskInput } = input;

    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }

    const task = await ctx.prisma.task.findFirst({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new Error('NOT_FOUND');
    }

    if (ctx.me.id !== task.userId) {
      throw new Error('NOT_YOUR_TASK');
    }

    await ctx.prisma.task.update({
      where: {
        id: taskId,
        userId: ctx.me.id,
      },
      data: {
        ...taskInput,
        award: taskInput.award * 60,
        penalty: taskInput.penalty * 60,
        deadline: taskInput.deadline ? new Date(taskInput.deadline) : null,
      },
    });

    return true;
  });
