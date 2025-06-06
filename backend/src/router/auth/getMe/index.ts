import { toClientMe } from '../../../lib/models';
import { trpcLoggedProcedure } from '../../../lib/trpc';

export const getMeTrpcRoute = trpcLoggedProcedure.query(({ ctx }) => {
  return { me: ctx.me && toClientMe(ctx.me) };
});
