import { trpc } from '../../lib/trpc';
import { getPasswordHash } from '../../utils/getPasswordHash';
import { zSignUpInput } from './input';

export const signUpTrpcRoute = trpc.procedure
  .input(zSignUpInput)
  .mutation(async ({ ctx, input }) => {
    const exUser = await ctx.prisma.user.findFirst({
      where: {
        name: { equals: input.name, mode: 'insensitive' },
      },
    });

    if (exUser) {
      throw new Error('User with this name already exists');
    }

    await ctx.prisma.user.create({
      data: {
        name: input.name,
        passwordHash: getPasswordHash(input.password),
      },
    });
    return true;
  });
