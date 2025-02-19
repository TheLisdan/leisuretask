import { z } from 'zod';

export const zSignUpInput = z.object({
  email: z.string().email('You must enter a valid email address'),
  name: z
    .string()
    .min(3, 'Name is too short')
    .max(50, 'Name is too long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Name can only contain letters, numbers and underscores'
    ),
  password: z.string().min(8, 'Password is too short'),
});
