import { CronJob } from 'cron';
import { AppContext } from './ctx';

export const applyCron = (ctx: AppContext) => {
  new CronJob(
    '0 7 * * *',
    () => {
      console.info('Hello!');
    },
    null,
    true
  );
};
