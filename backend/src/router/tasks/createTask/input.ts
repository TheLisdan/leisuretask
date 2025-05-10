import {
  zNumberRequired,
  zStringRequired,
  zCorrectDeadlineFormat,
} from '@leisuretask/shared/src/zod';
import { z } from 'zod';

export const zCreateTaskTrpcInput = z.object({
  title: zStringRequired,
  award: zNumberRequired,
  penalty: zNumberRequired,
  deadline: zCorrectDeadlineFormat,
});
