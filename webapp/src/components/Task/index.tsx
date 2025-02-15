import React from 'react';
import type { RouterOutputs } from '../../lib/trpc';
import css from './index.module.scss';

type TaskProps = {
  task: RouterOutputs['getTasks']['tasks'][0];
};

export const Task: React.FC<TaskProps> = ({ task }) => {
  const taskId = task.id?.toString();
  return (
    <div className={css.task}>
      <label className={css.checkboxContainer}>
        <input
          type="checkbox"
          title={taskId}
          name={taskId}
          id={taskId}
          defaultChecked={task.status === 'COMPLETED'}
          className={css.checkbox}
        />
        <span className={css.checkmark}></span>
      </label>
      <p className={css.label}>{task.title}</p>
    </div>
  );
};
