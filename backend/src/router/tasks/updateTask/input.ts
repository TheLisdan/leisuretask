import { zStringRequired } from '@leisuretask/shared/src/zod';
import { zCreateTaskTrpcInput } from '../createTask/input';

export const zUpdateTaskTrpcInput = zCreateTaskTrpcInput.extend({
  taskId: zStringRequired,
});
