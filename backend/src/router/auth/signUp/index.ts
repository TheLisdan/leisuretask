import { trpc } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { signJWT } from '../../../utils/signJWT';
import { zSignUpTrpcInput } from './input';

export const signUpTrpcRoute = trpc.procedure
  .input(zSignUpTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const exUser = await ctx.prisma.user.findFirst({
      where: {
        name: { equals: input.name, mode: 'insensitive' },
      },
    });

    if (exUser) {
      throw new Error('User with this name already exists');
    }

    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        passwordHash: getPasswordHash(input.password),
      },
    });

    const token = signJWT(user.id);
    return { token };
  });
