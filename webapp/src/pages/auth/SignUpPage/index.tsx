import { zSignUpTrpcInput } from '@leisuretask/backend/src/router/auth/signUp/input';
import cs from 'classnames';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { getHomeRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';

export const SignUpPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const trpcUtils = trpc.useUtils();
  const navigate = useNavigate();

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
          zSignUpTrpcInput
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
            setSubmittingError(null);
            const { token } = await signUp.mutateAsync(values);
            Cookies.set('token', token, { expires: 99999 });
            void trpcUtils.invalidate();
            navigate(getHomeRoute());
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
              className="error"
            />

            {submittingError && <div className="error">{submittingError}</div>}

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
