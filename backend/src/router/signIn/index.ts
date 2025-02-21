import { trpc } from '../../lib/trpc';
import { getPasswordHash } from '../../utils/getPasswordHash';
import { zSignInInput } from './input';

export const signInTrpcRoute = trpc.procedure
  .input(zSignInInput)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        name: input.name,
        passwordHash: getPasswordHash(input.password),
      },
    });

    if (!user) {
      throw new Error('Wrong nick or password');
    }

    return true;
  });
