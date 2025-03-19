import { zCreateTaskTrpcInput } from '@leisuretask/backend/src/router/createTask/input';
import cs from 'classnames';
import { format } from 'date-fns';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal } from '../../components/Modal';
import { PersistentSidebar } from '../../components/PersistentSidebar';
import { TaskDragWrapper } from '../../components/TodoList/TaskDragWrapper';
import { TaskSidebar } from '../../components/TodoList/TaskSidebar';
import { useTodoList } from '../../components/TodoList/useTodoList';
import css from './index.module.scss';
import { PlusIcon } from './plus-icon';

export const TodoListPage = () => {
  const {
    tasks,
    selectedTask,
    isLoading,
    tasksError,
    error,
    isModalOpen,
    moveTask,
    selectTask,
    handleCreateTask,
    openModal,
    closeModal,
  } = useTodoList();

  if (isLoading) {
    return <span>Loading...</span>;
  }
  if (tasksError) {
    return <span>Error: {tasksError.message}</span>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <PersistentSidebar>
        <h2>{format(new Date(), 'EEEE, do MMMM')}</h2>
        <p>There will be a calendar</p>
      </PersistentSidebar>

      <div className={css.content}>
        <h1 className={css.bigText}>
          <b>2 hours</b> of free time remaining
        </h1>
        <div className={css.taskWrapper}>
          {tasks.map((task, index) => (
            <TaskDragWrapper
              key={task.id}
              task={task}
              index={index}
              moveTask={moveTask}
              setSelectedTask={selectTask}
              isSelected={selectedTask?.id === task.id}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={openModal}
          className={css.openCreateTaskFormButton}
          title="Create task"
        >
          <PlusIcon className={css.plusIcon} />
        </button>
      </div>

      <TaskSidebar task={selectedTask} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Formik
          initialValues={{ title: '' }}
          validate={withZodSchema(zCreateTaskTrpcInput)}
          onSubmit={async (values, actions) => {
            try {
              await handleCreateTask(values);
              actions.resetForm();
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className={css.addTaskForm} id="addTaskForm">
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
                form="addTaskForm"
              >
                {isSubmitting ? 'Creating task...' : 'Create task'}
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </DndProvider>
  );
};
