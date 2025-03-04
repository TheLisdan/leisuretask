import cs from 'classnames';
import { format } from 'date-fns/format';
import React from 'react';
import { type TaskType } from '../../lib/trpcTypes';
import { Checkbox } from '../Checkbox';
import css from './index.module.scss';

type TaskProps = {
  task: TaskType;
  onClick: () => void;
  selected: boolean;
};

export const Task: React.FC<TaskProps> = ({ task, onClick, selected }) => {
  return (
    <div
      className={cs(css.task, { [css.selected]: selected })}
      onClick={onClick}
    >
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
