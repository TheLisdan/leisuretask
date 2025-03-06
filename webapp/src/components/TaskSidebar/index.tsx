import { zUpdateTaskTrpcInput } from '@leisuretask/backend/src/router/updateTask/input';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cs from 'classnames';
import { format } from 'date-fns';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { AnimatePresence, motion } from 'framer-motion';
import { pick } from 'lodash';
import React, { useRef, useState } from 'react';
import { trpc } from '../../lib/trpc';
import { TaskType } from '../../lib/trpcTypes';
import { Checkbox } from '../Checkbox';
import { Modal } from '../Modal';
import { CalendarTimeIcon } from './calendar-time-icon';
import { DeleteIcon } from './delete-icon';
import { EditIcon } from './edit-icon';
import css from './index.module.scss';
import { ThreeDotsIcon } from './three-dots-icon';

type TaskSidebarProps = {
  task: TaskType | null;
};

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ task }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [width, setWidth] = useState(300);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <DropdownMenu.Root
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
          >
            <DropdownMenu.Trigger asChild>
              <button type="button" className={css.taskOptions} title="More">
                <ThreeDotsIcon />
              </button>
            </DropdownMenu.Trigger>

            <AnimatePresence>
              {isDropdownOpen && (
                <DropdownMenu.Portal forceMount>
                  <DropdownMenu.Content asChild align="end">
                    <motion.div
                      className={css.dropdownMenu}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <DropdownMenu.Item
                        className={css.dropdownMenuItem}
                        onClick={() => setIsModalOpen(true)}
                      >
                        <EditIcon className={css.dropdownMenuItemIcon} />
                        Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator
                        className={css.dropdownMenuSeparator}
                      />
                      <DropdownMenu.Item
                        className={css.dropdownMenuItem}
                        onClick={async () => {
                          await deleteTaskMutation.mutateAsync({
                            taskId: task.id,
                          });
                          trpcUtils.getTasks.invalidate();
                        }}
                      >
                        <DeleteIcon className={css.dropdownMenuItemIcon} />
                        Delete
                      </DropdownMenu.Item>
                    </motion.div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              )}
            </AnimatePresence>
          </DropdownMenu.Root>
        </div>
      </aside>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Formik
          initialValues={pick(task, ['title'])}
          validate={withZodSchema(zUpdateTaskTrpcInput.omit({ taskId: true }))}
          onSubmit={async (values, actions) => {
            try {
              await updateTaskMutation.mutateAsync({
                taskId: task.id,
                ...values,
              });
              trpcUtils.getTasks.invalidate();
              actions.resetForm();
              setIsModalOpen(false);
            } catch (err: any) {
              setError(err.message);
              setTimeout(() => setError(null), 5000);
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className={css.updateTaskForm} id="updateTaskForm">
              <div className={css.taskField}>
                <label htmlFor="title" className={css.label}>
                  <b>Task</b>
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Task text"
                  className={cs(css.textInput, {
                    [css.disabled]: isSubmitting,
                  })}
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className={css.error}
                />
              </div>

              {error && <div className={css.error}>{error}</div>}

              <button
                type="submit"
                className={css.updateTaskButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating task...' : 'Update task'}
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
