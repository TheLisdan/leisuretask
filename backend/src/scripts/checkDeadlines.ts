import { AppContext } from '../lib/ctx';
import { logger } from '../lib/logger';

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

  logger.info(`Found ${expiredTasks.length} expired tasks`);

  for (const task of expiredTasks) {
    if (!task.statusChangeAt) {
      try {
        await ctx.prisma.task.update({
          where: {
            id: task.id,
          },
          data: {
            status: 'FAILED',
            statusChangeAt: now,
          },
        });
      } catch (error) {
        logger.error(`Error updating task ${task.id}:`, error);
      }
    }
  }
};
