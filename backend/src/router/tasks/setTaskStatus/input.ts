import { z } from 'zod';

export const zSetTaskStatusTrpcInput = z.object({
  taskId: z.string().min(1),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'FAILED']),
});
