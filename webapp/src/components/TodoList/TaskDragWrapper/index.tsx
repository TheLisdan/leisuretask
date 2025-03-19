import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TaskType } from '../../../lib/trpcTypes';
import { Task } from '../Task';
import css from './index.module.scss';

type DragItem = {
  id: string;
  index: number;
};

type TaskDragWrapperProps = {
  task: TaskType;
  index: number;
  moveTask: (fromIndex: number, toIndex: number) => void;
  setSelectedTask: (task: TaskType) => void;
  isSelected: boolean;
};

export const TaskDragWrapper: React.FC<TaskDragWrapperProps> = ({
  task,
  index,
  moveTask,
  setSelectedTask,
  isSelected,
}) => {
  const [, ref] = useDrag<DragItem>({
    type: 'TASK',
    item: { id: task.id, index },
  });

  const [, drop] = useDrop<DragItem>({
    accept: 'TASK',
    drop: async (draggedItem) => {
      if (draggedItem?.index !== undefined && draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleClick = React.useCallback(() => {
    setSelectedTask(task);
  }, [task, setSelectedTask]);

  return (
    <div className={css.taskDragWrapper} ref={(node) => ref(drop(node))}>
      <Task task={task} onClick={handleClick} selected={isSelected} />
    </div>
  );
};
