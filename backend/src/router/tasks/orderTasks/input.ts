import { z } from 'zod';

export const zOrderTasksTrpcInput = z.object({
  tasksIds: z.array(z.string().min(2)),
});
