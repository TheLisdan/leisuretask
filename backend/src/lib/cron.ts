import { CronJob } from 'cron';

export const applyCron = () => {
  new CronJob(
    '0 7 * * *',
    () => {
      console.info('Hello!');
    },
    null,
    true
  );
};
