import React from 'react';
import { Arrow } from '../../Arrow/arrow';
import css from './index.module.scss';

type TimeSelectorProps = {
  value: number;
  onChange: (value: number) => void;
  label: string;
};

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  label,
}) => {
  const timeOptions = [0, 5, 10, 15, 30, 45, 60, 90, 120, 180, 240, 300];
  const currentIndex = timeOptions.indexOf(value);

  return (
    <div className={css.timeSelector}>
      <label>{label}</label>
      <div className={css.controls}>
        <button
          type="button"
          onClick={() => onChange(timeOptions[currentIndex - 1])}
          disabled={currentIndex <= 0}
          title="←"
        >
          <Arrow direction={'left'} />
        </button>
        <span>{value} min</span>
        <button
          type="button"
          onClick={() => onChange(timeOptions[currentIndex + 1])}
          disabled={currentIndex >= timeOptions.length - 1}
          title="→"
        >
          <Arrow direction={'right'} />
        </button>
      </div>
    </div>
  );
};
