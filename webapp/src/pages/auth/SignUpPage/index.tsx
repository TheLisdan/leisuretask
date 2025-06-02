import { zSignUpTrpcInput } from '@leisuretask/backend/src/router/auth/signUp/input';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  zPasswordsMustBeTheSame,
  zStringMin,
} from '../../../../../shared/src/zod';
import { Form } from '../../../components/Form';
import { Field } from '../../../components/Form/Field';
import { Logo } from '../../../components/Logo';
import { mixpanelAlias, mixpanelTrackSignUp } from '../../../lib/mixpanel';
import { getHomeRoute, routes } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';

export const SignUpPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const trpcUtils = trpc.useUtils();
  const navigate = useNavigate();
  const signUp = trpc.signUp.useMutation();

  return (
    <div className={css.authContainer}>
      <Logo marginBottom />
      <div className={css.authCard}>
        <h1>Create Account</h1>
        <Form
          id="signUpForm"
          initialValues={{
            name: '',
            email: '',
            password: '',
            passwordAgain: '',
          }}
          validationSchema={zSignUpTrpcInput
            .extend({ passwordAgain: zStringMin(8) })
            .superRefine(zPasswordsMustBeTheSame('password', 'passwordAgain'))}
          onSubmit={async (values) => {
            try {
              setSubmittingError(null);
              const { token, userId } = await signUp.mutateAsync(values);
              mixpanelAlias(userId);
              mixpanelTrackSignUp();
              Cookies.set('token', token, { expires: 99999 });
              void trpcUtils.invalidate();
              navigate(getHomeRoute());
            } catch (error: any) {
              setSubmittingError(error.message);
            }
          }}
          submitButtonText="Create Account"
        >
          <Field
            name="name"
            label="Username"
            placeholder="Choose your username"
            stretch
            marginBottom
          />
          <Field
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            stretch
            marginBottom
          />
          <Field
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            stretch
            marginBottom
          />
          <Field
            name="passwordAgain"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            stretch
            marginBottom
          />
          {submittingError && (
            <div className={css.error}>{submittingError}</div>
          )}
        </Form>
      </div>
      <div className={css.switchAuth}>
        Already have an account?
        <Link to={routes.getSignInRoute()}>Sign In</Link>
      </div>
    </div>
  );
};
