import { TaskType } from '@leisuretask/shared/src/types/task';
import React from 'react';
import css from './index.module.scss';

type TaskProps = {
  task: Partial<TaskType>;
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
          defaultChecked={task.completed}
          className={css.checkbox}
        />
        <span className={css.checkmark}></span>
      </label>

      <p className={css.label}>{task.taskname}</p>
    </div>
  );
};
