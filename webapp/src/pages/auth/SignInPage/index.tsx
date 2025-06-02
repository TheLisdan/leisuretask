import { zSignInTrpcInput } from '@leisuretask/backend/src/router/auth/signIn/input';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from '../../../components/Form';
import { Field } from '../../../components/Form/Field';
import { Logo } from '../../../components/Logo';
import { mixpanelIdentify, mixpanelTrackSignIn } from '../../../lib/mixpanel';
import { getHomeRoute, routes } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';

export const SignInPage = () => {
  const [submittingError, setSubmittingError] = useState<string | null>(null);
  const trpcUtils = trpc.useUtils();
  const navigate = useNavigate();
  const signIn = trpc.signIn.useMutation();

  return (
    <div className={css.authContainer}>
      <Logo marginBottom />
      <div className={css.authCard}>
        <h1>Welcome Back</h1>
        <Form
          id="signInForm"
          initialValues={{
            name: '',
            password: '',
          }}
          validationSchema={zSignInTrpcInput}
          onSubmit={async (values) => {
            try {
              setSubmittingError(null);
              const { token, userId } = await signIn.mutateAsync(values);
              mixpanelIdentify(userId);
              mixpanelTrackSignIn();
              Cookies.set('token', token, { expires: 99999 });
              void trpcUtils.invalidate();
              navigate(getHomeRoute());
            } catch (error: any) {
              setSubmittingError(error.message);
            }
          }}
          submitButtonText="Sign In"
        >
          <Field
            name="name"
            label="Username"
            placeholder="Enter your username"
            stretch
            marginBottom
          />
          <Field
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            stretch
            marginBottom
          />
          {submittingError && (
            <div className={css.error}>{submittingError}</div>
          )}
        </Form>
      </div>
      <div className={css.switchAuth}>
        Don't have an account?
        <Link to={routes.getSignUpRoute()}>Sign Up</Link>
      </div>
    </div>
  );
};
