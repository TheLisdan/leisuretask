import cs from 'classnames';
import React from 'react';
import css from './index.module.scss';

type CheckboxProps = {
  name: string;
  checked: boolean;
  failed?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  checked,
  failed = false,
  onChange,
}) => {
  return (
    <label className={css.checkboxContainer}>
      <input
        type="checkbox"
        title={name}
        name={name}
        id={name}
        checked={checked}
        className={cs({ [css.checkbox]: true, [css.failed]: failed })}
        onChange={onChange}
      />
      <span className={css.checkmark}></span>
    </label>
  );
};
