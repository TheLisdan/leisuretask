import { zCreateTaskTrpcInput } from '@leisuretask/backend/src/router/createTask/input';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useState } from 'react';
import Modal from 'react-modal';
import { Link, Outlet } from 'react-router-dom';
import { getHomeRoute } from '../../lib/routes';
import { trpc } from '../../lib/trpc';
import css from './index.module.scss';
import { PlusIcon } from './plus-icon';
import { TodoLogo } from './todo-logo';

Modal.setAppElement('#root');

export const Layout = () => {
  // Modal state
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Create task mutation
  const createTask = trpc.createTask.useMutation();
  const trpcContext = trpc.useUtils();

  // Validation schema
  const validate = withZodSchema(zCreateTaskTrpcInput);

  // Layout component
  return (
    <div className={css.layout}>
      <nav className={css.navigation}>
        <Link to={getHomeRoute()} className={css.link}>
          <TodoLogo className={css.logo} />
        </Link>
      </nav>

      <button
        type="button"
        onClick={openModal}
        className={css.openCreateTaskFormButton}
        title="Create task"
      >
        <PlusIcon className={css.plusIcon} />
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={css.modal}
        overlayClassName={css.modalOverlay}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <Formik
          initialValues={{ taskname: '' }}
          validate={validate}
          onSubmit={async (values) => {
            await createTask.mutateAsync(values);
            trpcContext.getTasks.invalidate();
            closeModal();
          }}
        >
          <Form className={css.addTaskForm}>
            <label htmlFor="taskname" className={css.label}>
              <b>Task</b>
            </label>
            <Field
              type="text"
              id="taskname"
              name="taskname"
              placeholder="Task text"
              className={css.textInput}
            />
            <ErrorMessage
              name="taskname"
              component="div"
              className={css.error}
            />

            <button type="submit" className={css.createTaskButton}>
              Create task
            </button>
          </Form>
        </Formik>
      </Modal>
      <Outlet />
    </div>
  );
};
