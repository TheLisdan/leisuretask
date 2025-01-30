import { TaskType } from '@leisuretask/shared/src/types/task';
import _ from 'lodash';

export const tasks: TaskType[] = _.times(5, (i) => ({
  id: i + 1,
  taskname: `Task ${i + 1}`,
  completed: false,
}));
