import { zStringRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zDeleteTaskTrpcInput = z.object({
  taskId: zStringRequired,
});
