import { trpc } from '../../../lib/trpc';
import { zSaveTimeTrpcInput } from './input';

export const saveTimeTrpcRoute = trpc.procedure
  .input(zSaveTimeTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.me.id,
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    const timeDifference = input.remainingTime - user.avaiableTime;

    await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        avaiableTime:
          timeDifference < 0 ? user.avaiableTime : input.remainingTime,
        lastTimerUpdate: ctx.me.timerActive ? new Date() : undefined,
      },
    });

    return true;
  });
