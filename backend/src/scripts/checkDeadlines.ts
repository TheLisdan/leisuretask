import { AppContext } from '../lib/ctx';

export const checkDeadlines = async (ctx: AppContext) => {
  const now = new Date();

  const expiredTasks = await ctx.prisma.task.findMany({
    where: {
      status: 'IN_PROGRESS',
      deadline: {
        not: null,
        lt: now,
      },
    },
    include: {
      user: true,
    },
  });

  for (const task of expiredTasks) {
    console.info(`Processing task ${task.id}, current status: ${task.status}`);
    if (!task.statusChangeAt) {
      console.info(`Updating task ${task.id} to FAILED status`);
      try {
        await ctx.prisma.$transaction([
          ctx.prisma.task.update({
            where: {
              id: task.id,
            },
            data: {
              status: 'FAILED',
              statusChangeAt: now,
            },
          }),
          ctx.prisma.user.update({
            where: {
              id: task.userId,
            },
            data: {
              lastTimerUpdate: now,
              avaiableTime: {
                increment: -task.penalty,
              },
            },
          }),
        ]);
        console.info(
          `Successfully updated task ${task.id} and decremented user time by ${task.penalty}`
        );
      } catch (error) {
        console.error(`Error updating task ${task.id}:`, error);
      }
    }
  }
};
