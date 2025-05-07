import { AppContext } from '../lib/ctx';
import { sendRemindTasksEmail } from '../lib/emails';

export const remindTasks = async (ctx: AppContext) => {
  const users = await ctx.prisma.user.findMany({
    where: {
      tasks: {
        some: {
          status: 'IN_PROGRESS',
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      _count: {
        select: {
          tasks: {
            where: {
              status: 'IN_PROGRESS',
            },
          },
        },
      },
    },
  });

  for (const user of users) {
    sendRemindTasksEmail({
      user,
      tasksCount: user._count.tasks,
    });
  }
};
