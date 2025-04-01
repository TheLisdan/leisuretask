import { trpc } from '../../../lib/trpc';
import { zOrderTasksTrpcInput } from './input';

export const orderTasksTrpcRoute = trpc.procedure
  .input(zOrderTasksTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me || !ctx.me.id) {
      throw new Error('UNAUTHORIZED');
    }

    const userId = ctx.me.id;

    const tasks = await ctx.prisma.task.findMany({
      where: {
        id: { in: input.tasksIds },
        userId: userId,
      },
    });

    if (tasks.length !== input.tasksIds.length) {
      throw new Error('NOT_FOUND');
    }

    await ctx.prisma.$transaction(
      input.tasksIds.map((taskId, index) =>
        ctx.prisma.task.update({
          where: { id: taskId, userId: userId },
          data: { order: index + 1 },
        })
      )
    );

    return true;
  });
