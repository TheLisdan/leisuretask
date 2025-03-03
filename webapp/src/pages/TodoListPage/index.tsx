import { zCreateTaskTrpcInput } from '@leisuretask/backend/src/router/createTask/input';
import cs from 'classnames';
import { format } from 'date-fns';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal';
import { PersistentSidebar } from '../../components/PersistentSidebar';
import { Task } from '../../components/Task';
import { TaskSidebar } from '../../components/TaskSidebar';
import { trpc } from '../../lib/trpc';
import { TaskType } from '../../lib/trpcTypes';
import css from './index.module.scss';
import { PlusIcon } from './plus-icon';

export const TodoListPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  const createTaskMutation = trpc.createTask.useMutation();
  const trpcUtils = trpc.useUtils();

  const {
    data: tasksData,
    error: tasksError,
    isLoading,
    isFetching,
  } = trpc.getTasks.useQuery();

  useEffect(() => {
    if (tasksData && tasksData.tasks.length > 0) {
      setSelectedTask(tasksData.tasks[0]);
    }
  }, [tasksData]);

  if (isLoading || isFetching) {
    return <span>Loading...</span>;
  }
  if (tasksError) {
    return <span>Error: {tasksError.message}</span>;
  }

  return (
    <>
      <PersistentSidebar>
        <h2>{format(new Date(), 'EEEE, do MMMM')}</h2>
        <p>There will be a calendar</p>
      </PersistentSidebar>

      <div className={css.content}>
        <h1 className={css.bigText}>
          <b>2 hours</b> of free time remaining
        </h1>
        {tasksData?.tasks.map((task) => (
          <Task
            task={task}
            key={task.id}
            onClick={() => setSelectedTask(task)}
          />
        ))}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={css.openCreateTaskFormButton}
          title="Create task"
        >
          <PlusIcon className={css.plusIcon} />
        </button>
      </div>

      <TaskSidebar task={selectedTask} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Formik
          initialValues={{ title: '' }}
          validate={withZodSchema(zCreateTaskTrpcInput)}
          onSubmit={async (values, actions) => {
            try {
              await createTaskMutation.mutateAsync(values);
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
            <Form className={css.addTaskForm}>
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
                className={css.createTaskButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating task...' : 'Create task'}
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
