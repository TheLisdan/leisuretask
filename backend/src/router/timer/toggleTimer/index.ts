import { trpc } from '../../../lib/trpc';
import { zToggleTimerTrpcInput } from './input';

export const toggleTimerTrpcRoute = trpc.procedure
  .input(zToggleTimerTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }

    await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        timerActive: input.active,
        lastTimerUpdate: new Date(),
      },
    });

    return true;
  });
