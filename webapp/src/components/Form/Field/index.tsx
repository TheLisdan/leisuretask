import cs from 'classnames';
import { Field as FormikField, ErrorMessage, useFormikContext } from 'formik';
import { useState, useEffect } from 'react';
import css from './index.module.scss';

type FieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  isSubmitting?: boolean;
  type?: string;
  mode?: 'default' | 'inline';
  stretch?: boolean;
  [key: string]: any;
};

export const Field: React.FC<FieldProps> = ({
  name,
  isSubmitting: explicitIsSubmitting,
  label,
  placeholder,
  type = 'text',
  mode = 'default',
  stretch = false,
  ...rest
}) => {
  const { isSubmitting: contextIsSubmitting } = useFormikContext();
  const [isEditing, setIsEditing] = useState(false);

  const isSubmitting = explicitIsSubmitting ?? contextIsSubmitting;

  useEffect(() => {
    if (isSubmitting) {
      setIsEditing(false);
    }
  }, [isSubmitting]);

  const handleClick = () => {
    if (mode === 'inline') {
      setIsEditing(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (mode === 'inline') {
      setIsEditing(false);
    }
    rest.onBlur?.(e);
  };

  return (
    <div
      className={cs(css.field, { [css.inline]: mode === 'inline' })}
      onClick={handleClick}
    >
      {mode === 'default' && label && (
        <label htmlFor={name} className={css.label}>
          <b>{label}</b>
        </label>
      )}
      <FormikField
        type={type}
        id={name}
        name={name}
        placeholder={placeholder ?? ''}
        className={cs(css.textInput, {
          [css.disabled]: isSubmitting,
          [css.editing]: mode === 'inline' && isEditing,
          [css.stretch]: stretch,
        })}
        disabled={isSubmitting}
        onBlur={handleBlur}
        {...rest}
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
};
