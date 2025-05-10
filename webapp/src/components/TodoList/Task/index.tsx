import cs from 'classnames';
import { format } from 'date-fns/format';
import React from 'react';
import { trpc } from '../../../lib/trpc';
import { type TaskType } from '../../../lib/trpcTypes';
import { Checkbox } from '../../Checkbox';
import css from './index.module.scss';

type TaskProps = {
  task: TaskType;
  onClick: () => void;
  selected: boolean;
};

export const Task: React.FC<TaskProps> = ({ task, onClick, selected }) => {
  const taskId = task.id?.toString();

  const trpcUtils = trpc.useUtils();
  const setTaskStatus = trpc.setTaskStatus.useMutation({
    onMutate: async ({ taskId, status }) => {
      const prevData = trpcUtils.getTasks.getInfiniteData();

      trpcUtils.getTasks.setInfiniteData({ limit: 20 }, (old) => {
        if (!old) {
          return old;
        }

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            tasks: page.tasks.map((t) =>
              t.id === taskId ? { ...t, status } : t
            ),
          })),
        };
      });

      return { prevData };
    },
    onError: (err, variables, context) => {
      if (context?.prevData) {
        trpcUtils.getTasks.setInfiniteData({ limit: 20 }, context.prevData);
      }
    },
    onSettled: () => {
      trpcUtils.getTasks.invalidate();
      trpcUtils.getMe.invalidate();
    },
  });

  return (
    <div
      className={cs(css.task, {
        [css.selected]: selected,
        [css.failed]: task.status === 'FAILED',
      })}
      onClick={onClick}
    >
      <div className={css.mainInfo}>
        <Checkbox
          name={task.id}
          checked={task.status === 'COMPLETED'}
          failed={task.status === 'FAILED'}
          onChange={(e) => {
            if (!taskId) {
              return;
            }

            const isDeadlinePassed =
              task.deadline && new Date() > new Date(task.deadline);

            setTaskStatus.mutate({
              taskId,
              status: isDeadlinePassed
                ? 'FAILED'
                : e.target.checked
                  ? 'COMPLETED'
                  : 'IN_PROGRESS',
            });
          }}
        />
        <p className={css.title}>{task.title}</p>
      </div>
      {!!task.deadline && (
        <div className={css.additionalInfo}>
          {format(task.deadline, 'do MMMM, HH:mm')}
        </div>
      )}
    </div>
  );
};
