import { zEmailRequired, zNameRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zSignUpTrpcInput = z.object({
  name: zNameRequired,
  email: zEmailRequired,
  password: z.string().min(8, 'Password is too short'),
});
