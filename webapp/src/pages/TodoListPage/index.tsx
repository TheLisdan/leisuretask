import { zCreateTaskTrpcInput } from '@leisuretask/backend/src/router/createTask/input';
import cs from 'classnames';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useState } from 'react';
import Modal from 'react-modal';
import { PersistentSidebar } from '../../components/PersistentSidebar';
import { Task } from '../../components/Task';
import { TaskSidebar } from '../../components/TaskSidebar';
import { trpc } from '../../lib/trpc';
import { TaskType } from '../../lib/trpcTypes';
import css from './index.module.scss';
import { PlusIcon } from './plus-icon';

Modal.setAppElement('#root');

export const TodoListPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Modal state
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Create task mutation
  const createTask = trpc.createTask.useMutation();
  const trpcContext = trpc.useUtils();

  const { data, error, isLoading, isFetching, isError } =
    trpc.getTasks.useQuery();
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);

  if (isLoading && isFetching) {
    return <span>Loading...</span>;
  }
  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <>
      <PersistentSidebar>
        <h2>Tuesday, 14th January</h2>
        <p>There will be a calendar</p>
      </PersistentSidebar>

      <div className={css.content}>
        <h1 className={css.bigText}>
          <b>2 hours</b> of free time remaining
        </h1>
        {data?.tasks.map((task) => (
          <Task
            task={task}
            key={task.id}
            onClick={() => {
              setSelectedTask(task);
            }}
          />
        ))}

        <button
          type="button"
          onClick={openModal}
          className={css.openCreateTaskFormButton}
          title="Create task"
        >
          <PlusIcon className={css.plusIcon} />
        </button>
      </div>

      <TaskSidebar task={selectedTask} onClose={() => setSelectedTask(null)} />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={css.modal}
        overlayClassName={css.modalOverlay}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <Formik
          initialValues={{ title: '' }}
          validate={withZodSchema(zCreateTaskTrpcInput)}
          onSubmit={async (values, actions) => {
            try {
              await createTask.mutateAsync(values);
              trpcContext.getTasks.invalidate();
              actions.resetForm();
              closeModal();
              actions.setSubmitting(false);
            } catch (error: any) {
              setSubmittingError(error.message);
              actions.setSubmitting(false);
              setTimeout(() => {
                setSubmittingError(null);
              }, 5000);
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
                  className={cs({
                    [css.textInput]: true,
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

              {submittingError && (
                <div className={css.error}>{submittingError}</div>
              )}

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
