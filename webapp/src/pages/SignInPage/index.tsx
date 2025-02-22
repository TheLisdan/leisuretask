import { zSignInInput } from '@leisuretask/backend/src/router/signIn/input';
import cs from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { useState } from 'react';
import { trpc } from '../../lib/trpc';
import css from './index.module.scss';

export const SignInPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  const signIn = trpc.signIn.useMutation();

  return (
    <>
      <h1>Sign In</h1>
      <Formik
        initialValues={{
          name: '',
          password: '',
        }}
        onSubmit={async (values, actions) => {
          try {
            setSubmittingError(null);
            await signIn.mutateAsync(values);
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
        validate={withZodSchema(zSignInInput)}
      >
        {({ isSubmitting }) => (
          <Form className={css.signInForm}>
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

            {submittingError && (
              <div className={css.error}>{submittingError}</div>
            )}
            {successMessageVisible && (
              <div className={css.success}>Thanks for sign in!</div>
            )}

            <button
              type="submit"
              className={css.signInButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
