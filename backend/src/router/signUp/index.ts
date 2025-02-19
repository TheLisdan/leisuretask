import crypto from 'crypto';
import { trpc } from '../../lib/trpc';
import { zSignUpInput } from './input';

export const signUpTrpcRoute = trpc.procedure
  .input(zSignUpInput)
  .mutation(async ({ ctx, input }) => {
    const exUser = await ctx.prisma.user.findUnique({
      where: {
        name: input.name,
      },
    });

    if (exUser) {
      throw new Error('User with this name already exists');
    }

    await ctx.prisma.user.create({
      data: {
        name: input.name,
        passwordHash: crypto
          .createHash('sha256')
          .update(input.password)
          .digest('hex'),
      },
    });
    return true;
  });
