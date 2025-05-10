import { zNumberRequired } from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zSaveTimeTrpcInput = z.object({
  remainingTime: zNumberRequired.min(0, 'Таймер не может быть отрицательным'),
});
