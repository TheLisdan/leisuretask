import { trpc } from '../../lib/trpc';
import { zCreateTaskTrpcInput } from './input';

export const createTaskTrpcRoute = trpc.procedure
  .input(zCreateTaskTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }
    await ctx.prisma.task.create({
      data: {
        userId: ctx.me.id,
        title: input.title,
        status: 'IN_PROGRESS',
      },
    });
    return true;
  });
