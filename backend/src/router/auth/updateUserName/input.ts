import { zNameOptional } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zUpdateUserNameTrpcInput = z.object({
  name: zNameOptional,
});
