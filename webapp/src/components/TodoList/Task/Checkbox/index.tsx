import React from 'react';
import { TaskType } from '../../../../lib/trpcTypes';
import css from './index.module.scss';

type CheckboxProps = {
  task: TaskType;
};

export const Checkbox: React.FC<CheckboxProps> = ({ task }) => {
  const taskId = task.id?.toString();
  return (
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
  );
};
