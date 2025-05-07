import { zStringMax } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zCreateTaskTrpcInput = z.object({
  title: zStringMax(100),
});
