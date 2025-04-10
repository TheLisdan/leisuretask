import { z } from 'zod';

export const zChangePasswordInput = z.object({
  oldPassword: z.string().min(8, 'Old password is too short'),
  newPassword: z.string().min(8, 'New password is too short'),
});
