import '../lib/brevo.mock';
import '../lib/emails/utils.mock';
import '../lib/sentry.mock';

import { env } from '../lib/env';
import { omit } from '@leisuretask/shared/src/omit';
import { type Task, type User } from '@prisma/client';
import _ from 'lodash';
import { createAppContext } from '../lib/ctx';
import { getTrpcContext } from '../lib/trpc';
import { trpcRouter } from '../router';
import { deepMap } from '../utils/deepMap';
import { getPasswordHash } from '../utils/getPasswordHash';
import { type ExpressRequest } from '../utils/types';

if (env.NODE_ENV !== 'test') {
  throw new Error('Run integrations test ONLY with NODE_ENV=test');
}

export const appContext = createAppContext();

afterAll(appContext.stop);

beforeEach(async () => {
  await appContext.prisma.task.deleteMany();
  await appContext.prisma.user.deleteMany();
});

export const getTrpcCaller = (user?: User) => {
  const req = { user } as ExpressRequest;
  return trpcRouter.createCaller(getTrpcContext({ appContext, req }));
};

export const withoutNoize = (input: any): any => {
  return deepMap(input, ({ value }) => {
    if (_.isObject(value) && !_.isArray(value)) {
      return _.entries(value).reduce(
        (acc, [objectKey, objectValue]: [string, any]) => {
          if (
            [/^id$/, /Id$/, /At$/, /^url$/].some((regex) =>
              regex.test(objectKey)
            )
          ) {
            return acc;
          }
          return {
            ...acc,
            [objectKey]: objectValue,
          };
        },
        {}
      );
    }
    return value;
  });
};

export const createUser = async ({
  user = {},
  number = 1,
}: { user?: Partial<User>; number?: number } = {}) => {
  return await appContext.prisma.user.create({
    data: {
      name: `user${number}`,
      email: `user${number}@example.com`,
      passwordHash: user.passwordHash || getPasswordHash('1234'),
      ...omit(user, ['passwordHash']),
    },
  });
};

export const createTask = async ({
  task = {},
  author,
  number = 1,
}: {
  task?: Partial<Task>;
  author: Pick<User, 'id'>;
  number?: number;
}) => {
  return await appContext.prisma.task.create({
    data: {
      userId: author.id,
      title: `task${number}`,
      status: 'IN_PROGRESS',
      award: 60 * number,
      order: number,
      ...task,
    },
  });
};

export const createTaskWithAuthor = async ({
  author,
  task,
  number,
}: {
  author?: Partial<User>;
  task?: Partial<Task>;
  number?: number;
} = {}) => {
  const createdUser = await createUser({ user: author, number });
  const createdTask = await createTask({ task, author: createdUser, number });
  return {
    author: createdUser,
    task: createdTask,
  };
};
