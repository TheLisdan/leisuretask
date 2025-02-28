import { format } from 'date-fns';
import React from 'react';
import { TaskType } from '../../lib/trpcTypes';
import { Checkbox } from '../Checkbox';
import { CalendarTimeIcon } from './calendar-time-icon';
import { CloseIcon } from './close-icon';
import css from './index.module.scss';
import { ThreeDotsIcon } from './three-dots-icon';

type TaskSidebarProps = {
  task: TaskType | null;
  onClose: () => void;
};

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ task, onClose }) => {
  if (!task) {
    return null;
  }

  return (
    <aside className={css.taskSidebar}>
      <div className={css.taskHeader}>
        <div className={css.taskHeaderMain}>
          <Checkbox task={task} />
          <span className={css.verticalLine}></span>
          <div className={css.taskTime}>
            <CalendarTimeIcon className={css.calendarTimeIcon} />
            {format(task.createdAt, 'do MMMM, HH:mm')}
          </div>
        </div>
        <button
          type="button"
          className={css.closeButton}
          title="✖"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>
      <b className={css.taskTitle}>{task.title}</b>
      <div className={css.taskFooter}>
        <button type="button" className={css.taskOptions} title="More">
          <ThreeDotsIcon />
        </button>
      </div>
    </aside>
  );
};
