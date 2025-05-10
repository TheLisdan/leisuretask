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

    let timeBonus = 0;

    if (!task.statusChangeAt) {
      if (input.status === 'COMPLETED') {
        timeBonus = task.award;
      }
    }

    await ctx.prisma.$transaction([
      ctx.prisma.task.update({
        where: {
          id: input.taskId,
          userId: ctx.me.id,
        },
        data: {
          status: input.status,
          statusChangeAt: new Date(),
        },
      }),
      ctx.prisma.user.update({
        where: {
          id: ctx.me.id,
        },
        data: {
          lastTimerUpdate: new Date(),
          avaiableTime: {
            increment: timeBonus,
          },
        },
      }),
    ]);

    return true;
  });
