import { trpc } from '../../lib/trpc';
import { zCreateTaskTrpcInput } from './input';

export const createTaskTrpcRoute = trpc.procedure
  .input(zCreateTaskTrpcInput)
  .mutation(async ({ input, ctx }) => {
    await ctx.prisma.task.create({
      data: {
        title: input.title,
        status: 'IN_PROGRESS',
      },
    });
    return true;
  });
