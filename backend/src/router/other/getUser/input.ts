import { z } from 'zod';

export const zGetUserTrpcInput = z.object({
  userId: z.string().min(1),
});
