import { z } from 'zod';

export const zCreateTaskTrpcInput = z.object({
  taskname: z
    .string()
    .min(1, 'Enter task text')
    .max(100, 'Task text is too long'),
});
