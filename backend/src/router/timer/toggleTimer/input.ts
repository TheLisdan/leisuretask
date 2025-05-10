import { zBooleanRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zToggleTimerTrpcInput = z.object({
  active: zBooleanRequired,
});
