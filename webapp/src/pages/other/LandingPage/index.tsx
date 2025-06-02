import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '../../../components/Logo';
import { getSignInRoute, getSignUpRoute } from '../../../lib/routes';
import css from './index.module.scss';

export const LandingPage = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className={css.landing}>
      <header className={css.header}>
        <Logo />
        <nav className={css.nav}>
          <Link to={getSignInRoute()} className={css.signInButton}>
            {t('signIn')}
          </Link>
          <Link to={getSignUpRoute()} className={css.signUpButton}>
            {t('signUp')}
          </Link>
        </nav>
      </header>

      <main className={css.main}>
        <div className={css.hero}>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroSubtitle')}</p>
          <Link to={getSignUpRoute()} className={css.ctaButton}>
            {t('signUp')}
          </Link>
        </div>

        <div className={css.features}>
          <div className={css.feature}>
            <div className={css.featureIcon}>⏱️</div>
            <h3>{t('featureTimer')}</h3>
            <p>{t('featureTimerDesc')}</p>
          </div>
          <div className={css.feature}>
            <div className={css.featureIcon}>📋</div>
            <h3>{t('featureManagement')}</h3>
            <p>{t('featureManagementDesc')}</p>
          </div>
          <div className={css.feature}>
            <div className={css.featureIcon}>🎯</div>
            <h3>{t('featureRewards')}</h3>
            <p>{t('featureRewardsDesc')}</p>
          </div>
        </div>
      </main>

      <footer className={css.footer}>
        <div className={css.container}>
          <div className={css.copyright}>
            © {currentYear} Leisure Task. All rights reserved.
          </div>
          <div className={css.footerNav}>
            <a
              href="mailto:leisuretaskmanager@gmail.com"
              className={css.footerLink}
            >
              Contact us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
