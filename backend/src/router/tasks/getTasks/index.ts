import { ExpectedError } from '../../../lib/error';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { zGetTasksTrpcInput } from './input';

export const getTasksTrpcRoute = trpcLoggedProcedure
  .input(zGetTasksTrpcInput)
  .query(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new ExpectedError('Not authenticated');
    }
    const tasks = await ctx.prisma.task.findMany({
      where: {
        userId: ctx.me?.id,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        order: true,
        serialNumber: true,
        award: true,
        deadline: true,
      },
      orderBy: [
        {
          order: 'asc',
        },
        {
          serialNumber: 'asc',
        },
      ],
      cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
      take: input.limit + 1,
    });
    const nextTask = tasks.at(input.limit);
    const nextCursor = nextTask?.serialNumber;
    const tasksExceptLast = tasks.slice(0, input.limit);

    return { tasks: tasksExceptLast, nextCursor };
  });
