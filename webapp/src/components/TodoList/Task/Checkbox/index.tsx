import React from 'react';
import { trpc } from '../../../../lib/trpc';
import { TaskType } from '../../../../lib/trpcTypes';
import css from './index.module.scss';

type CheckboxProps = {
  task: TaskType;
};

export const Checkbox: React.FC<CheckboxProps> = ({ task }) => {
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
    },
  });

  return (
    <label className={css.checkboxContainer}>
      <input
        type="checkbox"
        title={taskId}
        name={taskId}
        id={taskId}
        checked={task.status === 'COMPLETED'}
        className={css.checkbox}
        onChange={(e) => {
          if (!taskId) {
            return;
          }

          setTaskStatus.mutate({
            taskId,
            status: e.target.checked ? 'COMPLETED' : 'IN_PROGRESS',
          });
        }}
      />
      <span className={css.checkmark}></span>
    </label>
  );
};
