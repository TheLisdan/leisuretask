import { z } from 'zod';

export const zUpdateProfileTrpcInput = z.object({
  name: z
    .string()
    .min(3, 'Name is too short')
    .max(50, 'Name is too long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Name can only contain letters, numbers and underscores'
    )
    .optional(),
});
