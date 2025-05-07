import { zStringRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zGetUserTrpcInput = z.object({
  userId: zStringRequired,
});
