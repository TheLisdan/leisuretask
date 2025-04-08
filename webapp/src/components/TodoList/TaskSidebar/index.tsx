import { zUpdateTaskTrpcInput } from '@leisuretask/backend/src/router/tasks/updateTask/input';
import { format } from 'date-fns';
import { pick } from 'lodash';
import React, { useRef, useState } from 'react';
import { trpc } from '../../../lib/trpc';
import { TaskType } from '../../../lib/trpcTypes';
import { Dropdown } from '../../Dropdown';
import { Form } from '../../Form';
import { Field } from '../../Form/Field';
import { Modal } from '../../Modal';
import { Checkbox } from '../Task/Checkbox';
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

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const updateTaskMutation = trpc.updateTask.useMutation();
  const deleteTaskMutation = trpc.deleteTask.useMutation();
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
        style={{ width }}
        onMouseDown={startResizing}
      >
        <div className={css.taskHeader}>
          <div className={css.taskHeaderMain}>
            <Checkbox task={task} />
            <span className={css.verticalLine}></span>
            <div className={css.taskTime}>
              <CalendarTimeIcon className={css.calendarTimeIcon} />
              {format(task.createdAt, 'do MMMM, HH:mm')}
            </div>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Form
          validationSchema={zUpdateTaskTrpcInput.omit({ taskId: true })}
          initialValues={pick(task, ['title'])}
          onSubmit={async (values) => {
            await updateTaskMutation.mutateAsync({
              taskId: task.id,
              ...values,
            });
            trpcUtils.getTasks.invalidate();
            setIsModalOpen(false);
          }}
          resetOnSuccess
          id="updateTaskForm"
          submitButtonText="Update task"
        >
          <Field name="title" label="Task" placeholder="Task text" />
        </Form>
      </Modal>
    </>
  );
};
