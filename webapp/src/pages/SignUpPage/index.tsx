import { zSignUpInput } from '@leisuretask/backend/src/router/signUp/input';
import cs from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useState } from 'react';
import { z } from 'zod';
import { trpc } from '../../lib/trpc';
import css from './index.module.scss';

export const SignUpPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const signUp = trpc.signUp.useMutation();

  return (
    <>
      <h1>Sign Up</h1>
      <Formik
        initialValues={{
          name: '',
          password: '',
          passwordAgain: '',
        }}
        validate={withZodSchema(
          zSignUpInput
            .extend({ passwordAgain: z.string().min(1) })
            .superRefine((val, ctx) => {
              if (val.password !== val.passwordAgain) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Passwords must be the same',
                  path: ['passwordAgain'],
                });
              }
            })
        )}
        onSubmit={async (values, actions) => {
          try {
            await signUp.mutateAsync(values);
            actions.resetForm();
            actions.setSubmitting(false);
            setSuccessMessageVisible(true);
            setTimeout(() => {
              setSuccessMessageVisible(false);
            }, 5000);
          } catch (error: any) {
            setSubmittingError(error.message);
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={css.signUpForm}>
            <label htmlFor="name" className={css.label}>
              <b>Name</b>
            </label>
            <Field
              type="text"
              id="name"
              name="name"
              placeholder="NickName"
              className={cs({
                [css.textInput]: true,
                [css.disabled]: isSubmitting,
              })}
              disabled={isSubmitting}
            />
            <ErrorMessage name="name" component="div" className={css.error} />

            <label htmlFor="password" className={css.label}>
              <b>Password</b>
            </label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className={cs({
                [css.textInput]: true,
                [css.disabled]: isSubmitting,
              })}
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="password"
              component="div"
              className={css.error}
            />

            <label htmlFor="passwordAgain" className={css.label}>
              <b>Password again</b>
            </label>
            <Field
              type="password"
              id="passwordAgain"
              name="passwordAgain"
              placeholder="Password again"
              className={cs({
                [css.textInput]: true,
                [css.disabled]: isSubmitting,
              })}
              disabled={isSubmitting}
            />
            <ErrorMessage
              name="passwordAgain"
              component="div"
              className={css.error}
            />

            {submittingError && (
              <div className={css.error}>{submittingError}</div>
            )}
            {successMessageVisible && (
              <div className={css.success}>Thanks for sign up!</div>
            )}

            <button
              type="submit"
              className={css.signUpButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
