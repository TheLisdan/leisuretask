import { zCreateTaskTrpcInput } from '@leisuretask/backend/src/router/tasks/createTask/input';
import { format } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Form } from '../../../components/Form';
import { Field } from '../../../components/Form/Field';
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
          <Field name="title" label="Task" placeholder="Task text" />
        </Form>
      </Modal>
    </DndProvider>
  );
};
