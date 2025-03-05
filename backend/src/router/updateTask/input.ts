import { z } from 'zod';
import { zCreateTaskTrpcInput } from '../createTask/input';

export const zUpdateTaskTrpcInput = zCreateTaskTrpcInput.extend({
  taskId: z.string().min(1),
});
