import { zStringMin } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zChangePasswordTrpcInput = z.object({
  oldPassword: zStringMin(8, 'Password must be at least'),
  newPassword: zStringMin(8, 'Password must be at least'),
});
