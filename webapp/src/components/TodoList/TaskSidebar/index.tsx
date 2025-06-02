import cs from 'classnames';
import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { mixpanelCompleteTask } from '../../../lib/mixpanel';
import { trpc } from '../../../lib/trpc';
import { TaskType } from '../../../lib/trpcTypes';
import { Checkbox } from '../../Checkbox';
import { Dropdown } from '../../Dropdown';
import { TaskModal } from '../TaskModal';
import { CalendarTimeIcon } from './calendar-time-icon';
import { DeleteIcon } from './delete-icon';
import { EditIcon } from './edit-icon';
import css from './index.module.scss';
import { ThreeDotsIcon } from './three-dots-icon';

type TaskSidebarProps = {
  task: TaskType | null;
};

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ task }) => {
  const [width, setWidth] = useState(300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const updateTaskMutation = trpc.updateTask.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();
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
  const trpcUtils = trpc.useUtils();

  const minWidth = 200;
  const maxWidth = 600;

  const startResizing = (event: React.MouseEvent) => {
    if (document.body.clientWidth - event.clientX > width - 5) {
      event.preventDefault();
      document.body.style.cursor = 'ew-resize';
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResizing);
    }
  };

  const resize = (event: MouseEvent) => {
    if (sidebarRef.current) {
      const newWidth = document.body.clientWidth - event.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    }
  };

  const stopResizing = () => {
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
  };

  if (!task) {
    return null;
  }

  return (
    <>
      <aside
        className={css.taskSidebar}
        ref={sidebarRef}
        style={isMobile ? undefined : { width }}
        onMouseDown={!isMobile ? startResizing : undefined}
      >
        <div className={css.taskHeader}>
          <div className={css.taskHeaderMain}>
            <Checkbox
              name={task.id}
              checked={task.status === 'COMPLETED'}
              failed={task.status === 'FAILED'}
              onChange={(e) => {
                if (!task.id) {
                  return;
                }

                const isDeadlinePassed =
                  task.deadline && new Date() > new Date(task.deadline);

                void setTaskStatus
                  .mutateAsync({
                    taskId: task.id,
                    status: isDeadlinePassed
                      ? 'FAILED'
                      : e.target.checked
                        ? 'COMPLETED'
                        : 'IN_PROGRESS',
                  })
                  .then(() => {
                    if (task.status === 'IN_PROGRESS') {
                      mixpanelCompleteTask(task);
                    }
                  });
              }}
            />
            {!!task.deadline && (
              <>
                <span className={css.verticalLine}></span>
                <div
                  className={cs({
                    [css.taskTime]: true,
                    [css.taskFailed]: task.status === 'FAILED',
                  })}
                >
                  <CalendarTimeIcon className={css.calendarTimeIcon} />
                  {format(task.deadline, 'do MMMM, HH:mm')}
                </div>
              </>
            )}
          </div>
        </div>
        <b className={css.taskTitle}>{task.title}</b>
        <div className={css.taskFooter}>
          <Dropdown
            trigger={
              <button type="button" className={css.taskOptions} title="More">
                <ThreeDotsIcon />
              </button>
            }
            align="end"
            items={[
              {
                label: 'Edit',
                icon: <EditIcon />,
                onClick: () => setIsModalOpen(true),
              },
              {
                type: 'separator',
              },
              {
                label: 'Delete',
                icon: <DeleteIcon />,
                onClick: async () => {
                  await deleteTaskMutation.mutateAsync({
                    taskId: task.id,
                  });
                  trpcUtils.getTasks.invalidate();
                },
              },
            ]}
          />
        </div>
      </aside>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (values) => {
          await updateTaskMutation.mutateAsync({
            taskId: task.id,
            ...values,
          });
          trpcUtils.getTasks.invalidate();
          setIsModalOpen(false);
        }}
        submitButtonText="Update task"
        task={task}
      />
    </>
  );
};
