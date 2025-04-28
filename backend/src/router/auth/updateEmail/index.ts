import { trpc } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { zUpdateEmailTrpcInput } from './input';

export const updateEmailTrpcRoute = trpc.procedure
  .input(zUpdateEmailTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }
    if (ctx.me.passwordHash !== getPasswordHash(input.password)) {
      throw new Error('Wrong password');
    }
    if (ctx.me.email === input.email) {
      throw new Error('Email is the same as current email');
    }
    const exUser = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (exUser) {
      throw new Error('Email already in use');
    }

    const updatedMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        email: input.email,
      },
    });
    ctx.me = updatedMe;
    return updatedMe;
  });
