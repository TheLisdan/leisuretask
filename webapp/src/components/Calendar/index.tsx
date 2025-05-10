import cs from 'classnames';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import React, { useState } from 'react';
import { Arrow } from '../Arrow/arrow';
import css from './index.module.scss';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const onPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const weekDays = Array.from(Array(7)).map((_, index) =>
    format(addDays(calendarStart, index), 'EEEEEE')
  );

  return (
    <div className={css.calendar}>
      <div className={css.header}>
        <span>{format(currentDate, 'LLLL, yyyy')}</span>
        <div className={css.navigation}>
          <button
            type="button"
            onClick={onPrevMonth}
            title="Previous month"
            className={css.switchMonth}
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            title="Next month"
            className={css.switchMonth}
          >
            <Arrow direction="right" />
          </button>
        </div>
      </div>

      <div className={css.weekDays}>
        {weekDays.map((day) => (
          <div key={day} className={css.weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={css.days}>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cs({
              [css.day]: true,
              [css.otherMonth]: !isSameMonth(day, monthStart),
              [css.today]: isSameDay(day, today),
            })}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};
