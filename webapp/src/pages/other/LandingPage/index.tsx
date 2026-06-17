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
        <section className={css.hero}>
          <div className={css.productPreview} aria-hidden="true">
            <div className={css.previewTop}>
              <span>Available time</span>
              <b>2:45:00</b>
            </div>
            <div className={css.previewTask}>
              <span className={css.previewCheck}></span>
              <span>Finish portfolio case</span>
              <b>+30m</b>
            </div>
            <div className={css.previewTask}>
              <span className={css.previewCheck}></span>
              <span>Review deployment</span>
              <b>+15m</b>
            </div>
            <div className={css.previewFooter}>
              <span>Deadline</span>
              <b>07:30</b>
            </div>
          </div>

          <div className={css.heroContent}>
            <p className={css.eyebrow}>{t('heroTitle')}</p>
            <h1>LeisureTask</h1>
            <p>{t('heroSubtitle')}</p>
            <Link to={getSignUpRoute()} className={css.ctaButton}>
              {t('signUp')}
            </Link>
          </div>
        </section>

        <section className={css.features}>
          <div className={css.feature}>
            <div className={css.featureIcon}>01</div>
            <h3>{t('featureTimer')}</h3>
            <p>{t('featureTimerDesc')}</p>
          </div>
          <div className={css.feature}>
            <div className={css.featureIcon}>02</div>
            <h3>{t('featureManagement')}</h3>
            <p>{t('featureManagementDesc')}</p>
          </div>
          <div className={css.feature}>
            <div className={css.featureIcon}>03</div>
            <h3>{t('featureRewards')}</h3>
            <p>{t('featureRewardsDesc')}</p>
          </div>
        </section>
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
