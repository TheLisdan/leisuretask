import cs from 'classnames';
import { Field as FormikField, ErrorMessage, useFormikContext } from 'formik';
import css from './index.module.scss';

type FieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  isSubmitting?: boolean;
  type?: string;
  [key: string]: any;
};

export const Field: React.FC<FieldProps> = ({
  name,
  isSubmitting: explicitIsSubmitting,
  label,
  placeholder,
  type = 'text',
  ...rest
}) => {
  const { isSubmitting: contextIsSubmitting } = useFormikContext();

  const isSubmitting = explicitIsSubmitting ?? contextIsSubmitting;

  return (
    <div className={css.field}>
      {label && (
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
        })}
        disabled={isSubmitting}
        {...rest}
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
};
