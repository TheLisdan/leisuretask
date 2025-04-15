import { trpc } from '../../../lib/trpc';
import { zGetTasksTrpcInput } from './input';

export const getTasksTrpcRoute = trpc.procedure
  .input(zGetTasksTrpcInput)
  .query(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('Not authenticated');
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
        serialNubmer: true,
      },
      orderBy: [
        {
          order: 'asc',
        },
        {
          serialNubmer: 'asc',
        },
      ],
      cursor: input.cursor ? { serialNubmer: input.cursor } : undefined,
      take: input.limit + 1,
    });
    const nextTask = tasks.at(input.limit);
    const nextCursor = nextTask?.serialNubmer;
    const tasksExceptLast = tasks.slice(0, input.limit);

    return { tasks: tasksExceptLast, nextCursor };
  });
