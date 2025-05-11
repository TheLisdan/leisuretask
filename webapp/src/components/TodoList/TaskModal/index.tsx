import { zCreateTaskTrpcInput } from '@leisuretask/backend/src/router/tasks/createTask/input';
import { format } from 'date-fns';
import { useState } from 'react';
import { TaskType } from '../../../lib/trpcTypes';
import { Checkbox } from '../../Checkbox';
import { Form } from '../../Form';
import { Field } from '../../Form/Field';
import { Line } from '../../Form/Line';
import { TimeSelector } from '../../Form/TimeSelector';
import { Modal } from '../../Modal';
import css from './index.module.scss';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    award: number;
    deadline?: string | null;
  }) => Promise<void>;
  submitButtonText: string;
  task?: TaskType;
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitButtonText,
  task,
}) => {
  const [award, setAward] = useState(() => (task ? task.award / 60 : 30));
  const [hasDeadline, setHasDeadline] = useState(() => !!task?.deadline);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form
        validationSchema={zCreateTaskTrpcInput}
        initialValues={{
          title: task?.title ?? '',
          award,

          deadline:
            task?.deadline && hasDeadline
              ? format(task.deadline, "yyyy-MM-dd'T'HH:mm")
              : '',
        }}
        onSubmit={async (values) => {
          await onSubmit({
            ...values,
            award,

            deadline: hasDeadline ? values.deadline : undefined,
          });
        }}
        resetOnSuccess
        id={task ? 'updateTaskForm' : 'createTaskForm'}
        submitButtonText={submitButtonText}
      >
        <Field
          name="title"
          label="Task"
          placeholder="Task text"
          stretch
          marginBottom
        />

        <Line />

        <div className={css.timeControls}>
          <TimeSelector value={award} onChange={setAward} label="Time Award" />
        </div>

        <Line />

        <div className={css.deadlineSection}>
          <div className={css.deadlineCheckbox}>
            <Checkbox
              name="setDeadline"
              checked={hasDeadline}
              onChange={(e) => setHasDeadline(e.target.checked)}
            />
            <span>Set deadline</span>
          </div>

          {hasDeadline && (
            <div className={css.deadlineControls}>
              <Field name="deadline" type="datetime-local" label="Deadline" />
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
};
