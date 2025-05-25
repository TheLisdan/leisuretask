import { CronJob } from 'cron';
import { checkDeadlines } from '../scripts/checkDeadlines';
import { remindTasks } from '../scripts/remindTasks';
import { type AppContext } from './ctx';
import { logger } from './logger';

export const applyCron = (ctx: AppContext) => {
  new CronJob(
    '* * * * *',
    () => {
      checkDeadlines(ctx).catch((error) => {
        logger.error({ logType: 'cron', error: error });
      });
    },
    null,
    true
  );
  new CronJob(
    '0 7 * * *',
    () => {
      remindTasks({ ctx }).catch((error) => {
        logger.error({ logType: 'cron', error: error });
      });
    },
    null,
    true
  );
};
