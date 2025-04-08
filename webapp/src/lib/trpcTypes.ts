import { type TrpcRouter } from '@leisuretask/backend/src/router';
import { inferRouterOutputs } from '@trpc/server';

export type TrpcRouterOutputs = inferRouterOutputs<TrpcRouter>;
export type TaskType = TrpcRouterOutputs['getTasks']['tasks'][0];
export type UserType = TrpcRouterOutputs['getUser'];
