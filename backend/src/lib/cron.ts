import { CronJob } from 'cron';
import { checkDeadlines } from '../scripts/checkDeadlines';
import { remindTasks } from '../scripts/remindTasks';
import { type AppContext } from './ctx';

export const applyCron = (ctx: AppContext) => {
  new CronJob('* * * * *', () => checkDeadlines(ctx), null, true);

  new CronJob('0 7 * * *', () => remindTasks(ctx), null, true);
};
