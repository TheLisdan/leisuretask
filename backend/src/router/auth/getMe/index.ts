import _ from 'lodash';
import { trpc } from '../../../lib/trpc';

export const getMeTrpcRoute = trpc.procedure.query(({ ctx }) => {
  return { me: ctx.me && _.pick(ctx.me, ['id', 'name']) };
});
