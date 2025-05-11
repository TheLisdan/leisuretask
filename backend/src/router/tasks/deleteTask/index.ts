import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zDeleteTaskTrpcInput } from './input';

export const deleteTaskTrpcRoute = trpcLoggedProcedure
  .input(zDeleteTaskTrpcInput)
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

    await ctx.prisma.task.delete({
      where: {
        id: input.taskId,
        userId: ctx.me.id,
      },
    });

    return true;
  });
