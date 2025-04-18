import { zCreateTaskTrpcInput } from '@leisuretask/backend/src/router/tasks/createTask/input';
import { format } from 'date-fns';
import { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Form } from '../../../components/Form';
import { Field } from '../../../components/Form/Field';
import { Loader } from '../../../components/Loader';
import { Modal } from '../../../components/Modal';
import { PersistentSidebar } from '../../../components/PersistentSidebar';
import { TaskDragWrapper } from '../../../components/TodoList/TaskDragWrapper';
import { TaskSidebar } from '../../../components/TodoList/TaskSidebar';
import { useTodoList } from '../../../components/TodoList/useTodoList';
import css from './index.module.scss';
import { PlusIcon } from './plus-icon';

export const TodoListPage = () => {
  const {
    tasks,
    selectedTask,
    isLoading,
    tasksError,
    isModalOpen,
    isFetchingNextPage,
    moveTask,
    selectTask,
    handleCreateTask,
    hasNextPage,
    fetchNextPage,
    openModal,
    closeModal,
  } = useTodoList();

  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <PersistentSidebar>
        <h2>{format(new Date(), 'EEEE, do MMMM')}</h2>
        <p>There will be a calendar</p>
      </PersistentSidebar>

      <div className={css.content} ref={pageRef}>
        <h1 className={css.bigText}>
          <b>2 hours</b> of free time remaining
        </h1>
        {isLoading && <Loader type="inline" />}
        {tasksError && <p className={css.error}>{tasksError.message}</p>}
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

          {hasNextPage && !isFetchingNextPage && (
            <button
              type="button"
              onClick={() => {
                void fetchNextPage();
              }}
              disabled={isFetchingNextPage}
              className={css.loadMoreButton}
            >
              Load more
            </button>
          )}
          {isFetchingNextPage && (
            <div className={css.loaderWrapper}>
              <Loader type="inline" />
            </div>
          )}
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
        <Form
          initialValues={{ title: '' }}
          validationSchema={zCreateTaskTrpcInput}
          onSubmit={async (values) => {
            await handleCreateTask(values);
          }}
          id="addTaskForm"
          resetOnSuccess
          submitButtonText="Create task"
        >
          <Field name="title" label="Task" placeholder="Task text" stretch />
        </Form>
      </Modal>
    </DndProvider>
  );
};
