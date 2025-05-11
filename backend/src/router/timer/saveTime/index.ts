import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zSaveTimeTrpcInput } from './input';

export const saveTimeTrpcRoute = trpcLoggedProcedure
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

    await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        avaiableTime: input.remainingTime,
        lastTimerUpdate: ctx.me.timerActive ? new Date() : undefined,
      },
    });

    return true;
  });
