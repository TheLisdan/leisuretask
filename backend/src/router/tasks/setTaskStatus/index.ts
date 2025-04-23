import { trpc } from '../../../lib/trpc';
import { zSetTaskStatusTrpcInput } from './input';

export const setTaskStatusTrpcRoute = trpc.procedure
  .input(zSetTaskStatusTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }

    const task = await ctx.prisma.task.findFirst({
      where: {
        id: input.taskId,
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
        id: input.taskId,
        userId: ctx.me.id,
      },
      data: {
        status: input.status,
      },
    });

    return true;
  });
