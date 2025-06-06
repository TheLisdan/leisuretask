import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zCreateTaskTrpcInput } from './input';

export const createTaskTrpcRoute = trpcLoggedProcedure
  .input(zCreateTaskTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED');
    }
    const lastTask = await ctx.prisma.task.findFirst({
      where: {
        userId: ctx.me.id,
        status: 'IN_PROGRESS',
      },
      orderBy: {
        order: 'desc',
      },
    });
    await ctx.prisma.task.create({
      data: {
        userId: ctx.me.id,
        title: input.title,
        status: 'IN_PROGRESS',
        award: input.award * 60,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
        order: lastTask ? lastTask.order + 1 : 1,
      },
    });
    return true;
  });
