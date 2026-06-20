import cs from 'classnames';
import { addDays, format, isPast, startOfWeek } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
} from 'react';
import { useDrag, useDrop } from 'react-dnd';
import css from './index.module.scss';
import { type DemoDragItem, type DemoTask, DEMO_TASK_DND_TYPE } from './model';

export const Metric = ({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'accent' | 'warning';
}) => (
  <div className={cs(css.metric, css[tone])}>
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

export const DemoCalendar = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index)
  );

  return (
    <div className={css.calendarStrip}>
      {days.map((day) => {
        const isToday =
          format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

        return (
          <div
            key={day.toISOString()}
            className={cs(css.day, { [css.today]: isToday })}
          >
            <span>{format(day, 'EEE')}</span>
            <b>{format(day, 'd')}</b>
          </div>
        );
      })}
    </div>
  );
};

export const ResizeHandle = ({
  side,
  label,
  value,
  min,
  max,
  onPointerDown,
  onKeyDown,
}: {
  side: 'left' | 'right';
  label: string;
  value: number;
  min: number;
  max: number;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}) => (
  <div
    role="separator"
    tabIndex={0}
    aria-label={label}
    aria-orientation="vertical"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    className={side === 'left' ? css.leftResizeHandle : css.rightResizeHandle}
    onPointerDown={onPointerDown}
    onKeyDown={onKeyDown}
  />
);

const TaskRow = ({
  task,
  index,
  selected,
  onSelect,
  onToggleComplete,
  onMove,
}: {
  task: DemoTask;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onToggleComplete: () => void;
  onMove: (fromTaskId: string, toTaskId: string) => void;
}) => {
  const isDeadlinePast = task.deadline && isPast(new Date(task.deadline));
  const startPointerReorder = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';

      const reorderOnMove = (moveEvent: PointerEvent) => {
        const elementBelowPointer = document.elementFromPoint(
          moveEvent.clientX,
          moveEvent.clientY
        );
        const targetRow = elementBelowPointer?.closest<HTMLElement>(
          '[data-demo-task-id]'
        );
        const targetTaskId = targetRow?.dataset.demoTaskId;
        const targetStatus = targetRow?.dataset.demoTaskStatus;

        if (
          targetTaskId &&
          targetTaskId !== task.id &&
          targetStatus === task.status
        ) {
          onMove(task.id, targetTaskId);
        }
      };

      const stopPointerReorder = () => {
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        document.removeEventListener('pointermove', reorderOnMove);
        document.removeEventListener('pointerup', stopPointerReorder);
        document.removeEventListener('pointercancel', stopPointerReorder);
      };

      document.addEventListener('pointermove', reorderOnMove);
      document.addEventListener('pointerup', stopPointerReorder);
      document.addEventListener('pointercancel', stopPointerReorder);
    },
    [onMove, task.id, task.status]
  );
  const [{ isDragging }, drag] = useDrag<
    DemoDragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: DEMO_TASK_DND_TYPE,
      item: { id: task.id, index, status: task.status },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [index, task.id, task.status]
  );
  const [{ canDrop, isOver }, drop] = useDrop<
    DemoDragItem,
    void,
    { canDrop: boolean; isOver: boolean }
  >(
    () => ({
      accept: DEMO_TASK_DND_TYPE,
      canDrop: (draggedItem) =>
        draggedItem.id !== task.id && draggedItem.status === task.status,
      hover: (draggedItem) => {
        if (
          draggedItem.id === task.id ||
          draggedItem.status !== task.status ||
          draggedItem.index === index
        ) {
          return;
        }

        onMove(draggedItem.id, task.id);
        draggedItem.index = index;
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver({ shallow: true }),
      }),
    }),
    [index, onMove, task.id, task.status]
  );

  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      className={cs(css.taskRow, css[task.status.toLowerCase()], {
        [css.selected]: selected,
        [css.dragging]: isDragging,
        [css.dropTarget]: canDrop && isOver,
      })}
      data-demo-task-id={task.id}
      data-demo-task-status={task.status}
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSelect();
        }
      }}
    >
      <span
        role="checkbox"
        aria-checked={task.status === 'COMPLETED'}
        tabIndex={0}
        className={css.checkControl}
        onClick={(event) => {
          event.stopPropagation();
          onToggleComplete();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            onToggleComplete();
          }
        }}
      />
      <span
        className={css.dragHandle}
        aria-hidden="true"
        onPointerDown={startPointerReorder}
      >
        <span />
        <span />
        <span />
      </span>
      <span className={css.taskCopy}>
        <b>{task.title}</b>
        <span>{task.note}</span>
      </span>
      <span className={css.taskMeta}>
        <span className={css.award}>+{Math.round(task.award / 60)}m</span>
        {task.deadline && (
          <span className={cs(css.deadline, { [css.late]: isDeadlinePast })}>
            {format(new Date(task.deadline), 'MMM d, HH:mm')}
          </span>
        )}
      </span>
    </motion.div>
  );
};

export const TaskGroup = ({
  title,
  tasks,
  selectedTaskId,
  onSelect,
  onToggleComplete,
  onMove,
}: {
  title: string;
  tasks: DemoTask[];
  selectedTaskId: string;
  onSelect: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onMove: (fromTaskId: string, toTaskId: string) => void;
}) => (
  <motion.section className={css.taskGroup} layout>
    <motion.div className={css.groupHeader} layout>
      <h2>{title}</h2>
      <span>{tasks.length}</span>
    </motion.div>
    {tasks.length ? (
      <motion.div className={css.taskRows} layout>
        <AnimatePresence initial={false}>
          {tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              index={index}
              selected={task.id === selectedTaskId}
              onSelect={() => onSelect(task.id)}
              onToggleComplete={() => onToggleComplete(task.id)}
              onMove={onMove}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    ) : (
      <p className={css.emptyGroup}>Nothing here. Clean slate, clean mind.</p>
    )}
  </motion.section>
);
