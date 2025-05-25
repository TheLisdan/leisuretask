import { pick } from '@leisuretask/shared/src/pick';
import { User } from '@prisma/client';

export const toClientMe = (user: User | null) => {
  return (
    user &&
    pick(user, [
      'id',
      'name',
      'email',
      'avatar',
      'avaiableTime',
      'timerActive',
      'lastTimerUpdate',
    ])
  );
};
