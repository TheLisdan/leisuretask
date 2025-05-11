import { toClientMe } from '../../../lib/models';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zUpdateUserNameTrpcInput } from './input';

export const updateUserNameTrpcRoute = trpcLoggedProcedure
  .input(zUpdateUserNameTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }
    if (ctx.me.name !== input.name) {
      const exUser = await ctx.prisma.user.findUnique({
        where: {
          name: input.name,
        },
      });
      if (exUser) {
        throw new Error('User with that name already exists');
      }
    }
    const updatedMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        name: input.name,
      },
    });
    ctx.me = updatedMe;
    return toClientMe(updatedMe);
  });
