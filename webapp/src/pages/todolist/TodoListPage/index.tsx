import { format } from 'date-fns/format';
import { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { Calendar } from '../../../components/Calendar';
import { Loader } from '../../../components/Loader';
import { PersistentSidebar } from '../../../components/PersistentSidebar';
import { Timer } from '../../../components/Timer';
import { TaskDragWrapper } from '../../../components/TodoList/TaskDragWrapper';
import { TaskModal } from '../../../components/TodoList/TaskModal';
import { TaskSidebar } from '../../../components/TodoList/TaskSidebar';
import { useTodoList } from '../../../components/TodoList/useTodoList';
import { getCurrentDateFnsLocale } from '../../../i18n/config';
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

  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED');
  const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS');
  const failedTasks = tasks.filter((task) => task.status === 'FAILED');

  const pageRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  return (
    <DndProvider backend={HTML5Backend}>
      <PersistentSidebar>
        <h2>
          {format(new Date(), 'EEEE, do MMMM', {
            locale: getCurrentDateFnsLocale(),
          })}
        </h2>
        <Calendar />
      </PersistentSidebar>

      <div className={css.content} ref={pageRef}>
        <h1 className={css.bigText}>
          <Timer />
        </h1>
        {isLoading && <Loader type="inline" />}
        {tasksError && <p className={css.error}>{tasksError.message}</p>}
        <div className={css.taskWrapper}>
          <h2 className={css.sectionTitle}>{t('inProgress')}</h2>
          {inProgressTasks.map((task, index) => (
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
              {t('loadMore')}
            </button>
          )}
          {isFetchingNextPage && (
            <div className={css.loaderWrapper}>
              <Loader type="inline" />
            </div>
          )}

          <h2 className={css.sectionTitle}>{t('completed')}</h2>
          {completedTasks.map((task, index) => (
            <TaskDragWrapper
              key={task.id}
              task={task}
              index={index}
              moveTask={moveTask}
              setSelectedTask={selectTask}
              isSelected={selectedTask?.id === task.id}
            />
          ))}

          <h2 className={css.sectionTitle}>{t('failed')}</h2>
          {failedTasks.map((task, index) => (
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
          title={t('createTask')}
        >
          <PlusIcon className={css.plusIcon} />
        </button>
      </div>

      <TaskSidebar task={selectedTask} />
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateTask}
        submitButtonText={t('createTask')}
      />
    </DndProvider>
  );
};
