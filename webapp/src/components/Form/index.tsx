import { TRPCClientError } from '@trpc/client';
import { Formik, FormikHelpers, Form as FormikForm, FormikProps } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import React, { useState } from 'react';
import { z } from 'zod';
import { sentryCaptureException } from '../../lib/sentry';
import css from './index.module.scss';

type FormProps<TZodSchema extends z.ZodTypeAny> = {
  initialValues: z.infer<TZodSchema>;
  validationSchema: TZodSchema;
  onSubmit: (
    values: z.infer<TZodSchema>,
    actions: FormikHelpers<z.infer<TZodSchema>>
  ) => Promise<any> | any;
  resetOnSuccess?: boolean;
  id: string;
  submitButtonText?: string;
  children:
    | React.ReactNode
    | ((formikProps: FormikProps<z.infer<TZodSchema>>) => React.ReactNode);
};

export const Form = <TZodSchema extends z.ZodTypeAny>({
  validationSchema,
  initialValues,
  onSubmit,
  resetOnSuccess = false,
  id,
  submitButtonText,
  children,
}: FormProps<TZodSchema>) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <Formik<z.infer<TZodSchema>>
      initialValues={initialValues}
      validate={withZodSchema(validationSchema)}
      onSubmit={async (values, formikHelpers) => {
        try {
          await onSubmit(values, formikHelpers);
          if (resetOnSuccess) {
            formikHelpers.resetForm();
          }
        } catch (error: any) {
          if (!(error instanceof TRPCClientError)) {
            sentryCaptureException(error);
          }
          setError(
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred'
          );
          setTimeout(() => setError(null), 5000);
        } finally {
          formikHelpers.setSubmitting(false);
        }
      }}
    >
      {(formikProps) => (
        <FormikForm className={css.form} id={id}>
          {/* Handle both function and element children */}
          {typeof children === 'function' ? children(formikProps) : children}

          {error && <div className="error">{error}</div>}

          {submitButtonText && (
            <button
              type="submit"
              className={css.submitButton}
              disabled={formikProps.isSubmitting}
              form={id}
            >
              {submitButtonText}
            </button>
          )}
        </FormikForm>
      )}
    </Formik>
  );
};
