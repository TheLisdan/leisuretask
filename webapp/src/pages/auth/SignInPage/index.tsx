import { zSignInTrpcInput } from '@leisuretask/backend/src/router/auth/signIn/input';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from '../../../components/Form';
import { Field } from '../../../components/Form/Field';
import { Logo } from '../../../components/Logo';
import { mixpanelIdentify, mixpanelTrackSignIn } from '../../../lib/mixpanel';
import { getHomeRoute, getSignUpRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';

export const SignInPage = () => {
  const { t } = useTranslation();
  const trpcUtils = trpc.useUtils();
  const navigate = useNavigate();
  const signInMutation = trpc.signIn.useMutation();

  return (
    <div className={css.authContainer}>
      <div className={css.authCard}>
        <Logo marginBottom />
        <h1>{t('signIn')}</h1>
        <Form
          id="signInForm"
          initialValues={{
            name: '',
            password: '',
          }}
          validationSchema={zSignInTrpcInput}
          onSubmit={async (values) => {
            const { token, userId } = await signInMutation.mutateAsync(values);
            mixpanelIdentify(userId);
            mixpanelTrackSignIn();
            Cookies.set('token', token, { expires: 99999 });
            void trpcUtils.invalidate();
            navigate(getHomeRoute());
          }}
          submitButtonText={t('signIn')}
        >
          <Field
            name="name"
            label={t('name')}
            type="text"
            placeholder={t('name')}
            stretch
            marginBottom
          />

          <Field
            name="password"
            label={t('password')}
            type="password"
            placeholder={t('typePassword')}
            stretch
            marginBottom
          />
        </Form>
        <div className={css.switchAuth}>
          {t('dontHaveAccount')}
          <Link to={getSignUpRoute()}>{t('signUp')}</Link>
        </div>
      </div>
    </div>
  );
};
