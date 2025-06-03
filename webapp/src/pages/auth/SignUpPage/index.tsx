import { zSignUpTrpcInput } from '@leisuretask/backend/src/router/auth/signUp/input';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  zPasswordsMustBeTheSame,
  zStringMin,
} from '../../../../../shared/src/zod';
import { Form } from '../../../components/Form';
import { Field } from '../../../components/Form/Field';
import { Logo } from '../../../components/Logo';
import { mixpanelAlias, mixpanelTrackSignUp } from '../../../lib/mixpanel';
import { getHomeRoute, getSignInRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';

export const SignUpPage = () => {
  const { t } = useTranslation();
  const trpcUtils = trpc.useUtils();
  const navigate = useNavigate();
  const signUpMutation = trpc.signUp.useMutation();

  return (
    <div className={css.authContainer}>
      <div className={css.authCard}>
        <Logo marginBottom />
        <h1>{t('signUp')}</h1>
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
            const { token, userId } = await signUpMutation.mutateAsync(values);
            mixpanelAlias(userId);
            mixpanelTrackSignUp();
            Cookies.set('token', token, { expires: 99999 });
            void trpcUtils.invalidate();
            navigate(getHomeRoute());
          }}
          submitButtonText={t('signUp')}
        >
          <Field
            name="name"
            label={t('name')}
            placeholder={t('name')}
            stretch
            marginBottom
          />

          <Field
            name="email"
            label={t('email')}
            type="email"
            placeholder={t('typeEmail')}
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

          <Field
            name="passwordAgain"
            type="password"
            label={t('newPasswordAgain')}
            placeholder={t('typeNewPasswordAgain')}
            stretch
            marginBottom
          />
        </Form>
        <div className={css.switchAuth}>
          {t('alreadyHaveAccount')}
          <Link to={getSignInRoute()}>{t('signIn')}</Link>
        </div>
      </div>
    </div>
  );
};
