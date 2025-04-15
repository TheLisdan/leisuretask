import { zSignInTrpcInput } from '@leisuretask/backend/src/router/auth/signIn/input';
import cs from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomeRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';

export const SignInPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const trpcUtils = trpc.useUtils();
  const navigate = useNavigate();

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
            const { token } = await signIn.mutateAsync(values);
            Cookies.set('token', token, { expires: 99999 });
            void trpcUtils.invalidate();
            navigate(getHomeRoute());
          } catch (error: any) {
            setSubmittingError(error.message);
            actions.setSubmitting(false);
          }
        }}
        validate={withZodSchema(zSignInTrpcInput)}
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
            <ErrorMessage name="name" component="div" className="error" />

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
            <ErrorMessage name="password" component="div" className="error" />

            {submittingError && <div className="error">{submittingError}</div>}

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
