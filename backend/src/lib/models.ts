import { User } from '@prisma/client';
import _ from 'lodash';

export const toClientMe = (user: User | null) => {
  return user && _.pick(user, ['id', 'name', 'avatar']);
};
