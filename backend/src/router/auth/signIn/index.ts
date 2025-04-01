import { trpc } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { signJWT } from '../../../utils/signJWT';
import { zSignInInput } from './input';

export const signInTrpcRoute = trpc.procedure
  .input(zSignInInput)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        name: { equals: input.name, mode: 'insensitive' },
        passwordHash: getPasswordHash(input.password),
      },
    });

    if (!user) {
      throw new Error('Wrong nick or password');
    }

    const token = signJWT(user.id);
    return { token };
  });
