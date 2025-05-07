import { zStringMin } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zOrderTasksTrpcInput = z.object({
  tasksIds: z.array(zStringMin(2)),
});
