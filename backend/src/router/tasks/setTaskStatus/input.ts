import { zStatusRequired, zStringRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zSetTaskStatusTrpcInput = z.object({
  taskId: zStringRequired,
  status: zStatusRequired,
});
