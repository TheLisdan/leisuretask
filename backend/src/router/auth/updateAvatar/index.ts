import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zUpdateAvatarTrpcInput } from './input';

export const updateAvatarTrpcRoute = trpcLoggedProcedure
  .input(zUpdateAvatarTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }

    const updatedMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        avatar: input.avatar,
      },
    });
    ctx.me = updatedMe;
    return updatedMe;
  });
