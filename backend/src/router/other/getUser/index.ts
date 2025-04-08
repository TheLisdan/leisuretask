import { trpc } from '../../../lib/trpc';
import { zGetUserTrpcInput } from './input';

export const getUserTrpcRoute = trpc.procedure
  .input(zGetUserTrpcInput)
  .query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });
    return user;
  });
