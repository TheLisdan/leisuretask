import { trpc } from '../../lib/trpc';

export const getTasksTrpcRoute = trpc.procedure.query(async ({ ctx }) => {
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
    },
    orderBy: {
      order: 'asc',
    },
  });
  return { tasks };
});
