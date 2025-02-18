import { trpc } from '../../lib/trpc';

export const getTasksTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
  const tasks = await ctx.prisma.task.findMany({
    select: {
      id: true,
      title: true,
      status: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return { tasks };
});
