import { z } from 'zod';

export const zUpdateAvatarTrpcInput = z.object({
  avatar: z.string().nullable(),
});
