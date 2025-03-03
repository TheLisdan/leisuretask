import { format } from 'date-fns/format';
import React from 'react';
import { type TaskType } from '../../lib/trpcTypes';
import { Checkbox } from '../Checkbox';
import css from './index.module.scss';

type TaskProps = {
  task: TaskType;
  onClick: () => void;
};

export const Task: React.FC<TaskProps> = ({ task, onClick }) => {
  return (
    <div className={css.task} onClick={onClick}>
      <div className={css.mainInfo}>
        <Checkbox task={task} />
        <p className={css.title}>{task.title}</p>
      </div>
      <div className={css.additionalInfo}>
        {format(task.createdAt, 'do MMMM, HH:mm')}
      </div>
    </div>
  );
};
