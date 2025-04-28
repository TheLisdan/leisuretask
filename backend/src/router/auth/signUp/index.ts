import { trpc } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { signJWT } from '../../../utils/signJWT';
import { zSignUpTrpcInput } from './input';

export const signUpTrpcRoute = trpc.procedure
  .input(zSignUpTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const exName = await ctx.prisma.user.findFirst({
      where: {
        name: { equals: input.name, mode: 'insensitive' },
      },
    });

    if (exName) {
      throw new Error('User with this name already exists');
    }

    const exEmail = await ctx.prisma.user.findFirst({
      where: {
        email: { equals: input.email, mode: 'insensitive' },
      },
    });

    if (exEmail) {
      throw new Error('User with this E-Mail already exists');
    }

    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: getPasswordHash(input.password),
      },
    });

    const token = signJWT(user.id);
    return { token };
  });
