import { zNameRequired, zStringMin } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zSignInTrpcInput = z.object({
  name: zNameRequired,
  password: zStringMin(8, 'Password must be at least'),
});
