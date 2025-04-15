import { trpc } from '../../../lib/trpc';
import { getPasswordHash } from '../../../utils/getPasswordHash';
import { zChangePasswordTrpcInput } from './input';

export const changePasswordTrpcRoute = trpc.procedure
  .input(zChangePasswordTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }
    if (ctx.me.passwordHash !== getPasswordHash(input.oldPassword)) {
      throw new Error('Wrong old password');
    }
    const updatedMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        passwordHash: getPasswordHash(input.newPassword),
      },
    });
    ctx.me = updatedMe;
    return true;
  });
