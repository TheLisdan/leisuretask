import { sendWelcomeEmail } from '../../../lib/emails';
import { ExpectedError } from '../../../lib/error';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { signJWT } from '../../../utils/signJWT';
import { zSignUpTrpcInput } from './input';

export const signUpTrpcRoute = trpcLoggedProcedure
  .input(zSignUpTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const exName = await ctx.prisma.user.findFirst({
      where: {
        name: { equals: input.name, mode: 'insensitive' },
      },
    });

    if (exName) {
      throw new ExpectedError('User with this name already exists');
    }

    const exEmail = await ctx.prisma.user.findFirst({
      where: {
        email: { equals: input.email, mode: 'insensitive' },
      },
    });

    if (exEmail) {
      throw new ExpectedError('User with this E-Mail already exists');
    }

    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: getPasswordHash(input.password),
      },
    });

    void sendWelcomeEmail({ user });
    const token = signJWT(user.id);
    return { token, userId: user.id };
  });
