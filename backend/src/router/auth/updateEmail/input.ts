import { zEmailRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zUpdateEmailTrpcInput = z.object({
  email: zEmailRequired,
  password: z.string().min(8, 'Password is too short'),
});
