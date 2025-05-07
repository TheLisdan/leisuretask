import { zCursorOptional, zLimitRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zGetTasksTrpcInput = z.object({
  cursor: zCursorOptional,
  limit: zLimitRequired,
});
