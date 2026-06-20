import cs from 'classnames';
import { motion, useReducedMotion } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from 'react-router-dom';
import { Logo } from '../../../components/Logo';
import { getLandingRoute } from '../../../lib/routes';
import { DemoCalendar, Metric, ResizeHandle, TaskGroup } from './components';
import css from './index.module.scss';
import {
  formatTime,
  LEFT_PANEL_RANGE,
  RIGHT_PANEL_RANGE,
  statusLabels,
  TIME_OPTIONS,
} from './model';
import { useDemoPageState } from './useDemoPageState';

export const DemoPage = () => {
  const {
    state,
    layout,
    pageStyle,
    groupedTasks,
    selectedTask,
    newTaskTitle,
    setNewTaskTitle,
    newTaskAward,
    setNewTaskAward,
    draftTitle,
    setDraftTitle,
    draftAward,
    setDraftAward,
    draftDeadline,
    setDraftDeadline,
    completedCount,
    earnedToday,
    deadlineCount,
    selectTask,
    toggleTimer,
    toggleComplete,
    setTaskStatus,
    addTask,
    saveSelectedTask,
    deleteSelectedTask,
    moveSelectedTask,
    moveTask,
    resetDemo,
    startResize,
    handleResizeKeyDown,
  } = useDemoPageState();
  const prefersReducedMotion = useReducedMotion();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={css.demoPage} style={pageStyle}>
        <aside className={css.leftRail}>
          <ResizeHandle
            side="left"
            label="Resize calendar rail"
            value={layout.left}
            min={LEFT_PANEL_RANGE.min}
            max={LEFT_PANEL_RANGE.max}
            onPointerDown={(event) => startResize('left', event)}
            onKeyDown={(event) => handleResizeKeyDown('left', event)}
          />
          <Logo />
          <div className={css.railUser}>
            <span>{state.user.name.slice(0, 1)}</span>
            <div>
              <b>{state.user.name}</b>
              <p>{state.user.email}</p>
            </div>
          </div>
          <DemoCalendar />
          <div className={css.railNarrative}>
            <b>Today&apos;s rhythm</b>
            <p>
              Finish meaningful work, earn time, then spend it with intention.
            </p>
          </div>
          <Link to={getLandingRoute()} className={css.backLink}>
            Back to story
          </Link>
        </aside>

        <main className={css.commandCenter}>
          <header className={css.topBar}>
            <div>
              <span className={css.kicker}>Time budget command center</span>
              <h1>Turn completed tasks into protected leisure time.</h1>
            </div>
            <button
              type="button"
              className={css.resetButton}
              onClick={resetDemo}
            >
              Reset demo
            </button>
          </header>

          <section className={css.timerPanel}>
            <div className={css.timerDial}>
              <span>Available time</span>
              <motion.b
                key={formatTime(state.user.avaiableTime)}
                initial={prefersReducedMotion ? false : { opacity: 0.4, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {formatTime(state.user.avaiableTime)}
              </motion.b>
            </div>
            <div className={css.timerCopy}>
              <p>
                {state.user.timerActive
                  ? 'Leisure timer is running. Time drains in real time.'
                  : 'Complete a task to grow the time budget, then start the timer.'}
              </p>
              <button
                type="button"
                className={css.primaryButton}
                disabled={state.user.avaiableTime <= 0}
                onClick={toggleTimer}
              >
                {state.user.timerActive ? 'Pause timer' : 'Start timer'}
              </button>
            </div>
            <div className={css.metrics}>
              <Metric
                label="Completed"
                value={completedCount.toString()}
                tone="accent"
              />
              <Metric
                label="Earned"
                value={`${Math.round(earnedToday / 60)}m`}
              />
              <Metric
                label="Deadlines"
                value={deadlineCount.toString()}
                tone="warning"
              />
            </div>
          </section>

          <form
            className={css.quickCreate}
            onSubmit={(event) => {
              event.preventDefault();
              addTask();
            }}
          >
            <input
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              placeholder="Add a focused task"
              aria-label="Task title"
            />
            <select
              value={newTaskAward}
              onChange={(event) => setNewTaskAward(Number(event.target.value))}
              aria-label="Time award"
            >
              {TIME_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  +{minutes}m
                </option>
              ))}
            </select>
            <button type="submit">Create task</button>
          </form>

          <div className={css.groupsGrid}>
            <TaskGroup
              title={statusLabels.IN_PROGRESS}
              tasks={groupedTasks.IN_PROGRESS}
              selectedTaskId={state.selectedTaskId}
              onSelect={selectTask}
              onToggleComplete={toggleComplete}
              onMove={moveTask}
            />
            <TaskGroup
              title={statusLabels.COMPLETED}
              tasks={groupedTasks.COMPLETED}
              selectedTaskId={state.selectedTaskId}
              onSelect={selectTask}
              onToggleComplete={toggleComplete}
              onMove={moveTask}
            />
            <TaskGroup
              title={statusLabels.FAILED}
              tasks={groupedTasks.FAILED}
              selectedTaskId={state.selectedTaskId}
              onSelect={selectTask}
              onToggleComplete={toggleComplete}
              onMove={moveTask}
            />
          </div>
        </main>

        <aside className={css.detailPanel}>
          <ResizeHandle
            side="right"
            label="Resize task detail panel"
            value={layout.right}
            min={RIGHT_PANEL_RANGE.min}
            max={RIGHT_PANEL_RANGE.max}
            onPointerDown={(event) => startResize('right', event)}
            onKeyDown={(event) => handleResizeKeyDown('right', event)}
          />
          {selectedTask ? (
            <>
              <div className={css.detailHeader}>
                <span
                  className={cs(
                    css.statusPill,
                    css[selectedTask.status.toLowerCase()]
                  )}
                >
                  {statusLabels[selectedTask.status]}
                </span>
                <b>Task detail</b>
              </div>

              <label className={css.detailField}>
                <span>Title</span>
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                />
              </label>
              <label className={css.detailField}>
                <span>Time award</span>
                <select
                  value={draftAward}
                  onChange={(event) =>
                    setDraftAward(Number(event.target.value))
                  }
                >
                  {TIME_OPTIONS.map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {minutes} minutes
                    </option>
                  ))}
                </select>
              </label>
              <label className={css.detailField}>
                <span>Deadline</span>
                <input
                  type="datetime-local"
                  value={draftDeadline}
                  onChange={(event) => setDraftDeadline(event.target.value)}
                />
              </label>

              <p className={css.detailNote}>{selectedTask.note}</p>

              <div className={css.detailActions}>
                <button
                  type="button"
                  className={css.primaryButton}
                  onClick={saveSelectedTask}
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => toggleComplete(selectedTask.id)}
                >
                  {selectedTask.status === 'COMPLETED'
                    ? 'Reopen'
                    : 'Mark complete'}
                </button>
                <button
                  type="button"
                  onClick={() => setTaskStatus(selectedTask.id, 'FAILED')}
                >
                  Mark failed
                </button>
                <button type="button" onClick={() => moveSelectedTask(-1)}>
                  Move up
                </button>
                <button type="button" onClick={() => moveSelectedTask(1)}>
                  Move down
                </button>
                <button
                  type="button"
                  className={css.dangerButton}
                  onClick={deleteSelectedTask}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className={css.emptyDetail}>
              <b>No task selected</b>
              <p>Create a task to start earning time again.</p>
            </div>
          )}
        </aside>
      </div>
    </DndProvider>
  );
};
