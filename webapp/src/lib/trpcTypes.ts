import { type TrpcRouter } from '@leisuretask/backend/src/router';
import { inferRouterOutputs } from '@trpc/server';

export type RouterOutputs = inferRouterOutputs<TrpcRouter>;
export type TaskType = RouterOutputs['getTasks']['tasks'][0];
