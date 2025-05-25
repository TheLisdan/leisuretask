import { getHomeRoute } from '@leisuretask/webapp/src/lib/routes';
import { User } from '@prisma/client';
import { env } from '../env';
import { sendEmail } from './utils';

export const sendWelcomeEmail = async ({
  user,
}: {
  user: Pick<User, 'name' | 'email'>;
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks for signing up!',
    templateName: 'welcome',
    templateVariables: {
      userName: user.name,
      appUrl: `${env.WEBAPP_URL}${getHomeRoute()}`,
    },
  });
};

export const sendRemindTasksEmail = async ({
  user,
  tasksCount,
}: {
  user: Pick<User, 'name' | 'email'>;
  tasksCount: number;
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Start your day productively!',
    templateName: 'tasksReminder',
    templateVariables: {
      userName: user.name,
      tasksCount,
      appUrl: `${env.WEBAPP_URL}${getHomeRoute()}`,
    },
  });
};
