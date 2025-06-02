import { Link } from 'react-router-dom';
import { Logo } from '../../../components/Logo';
import { routes } from '../../../lib/routes';
import css from './index.module.scss';

export const LandingPage = () => {
  return (
    <div className={css.landing}>
      <header className={css.header}>
        <Logo />
        <div className={css.nav}>
          <Link to={routes.getSignInRoute()} className={css.signInButton}>
            Sign In
          </Link>
          <Link to={routes.getSignUpRoute()} className={css.signUpButton}>
            Sign Up
          </Link>
        </div>
      </header>

      <main className={css.main}>
        <div className={css.hero}>
          <h1>Manage Your Time with Pleasure</h1>
          <p>
            LeisureTask helps you efficiently plan tasks and get rewards for
            completing them
          </p>
          <Link to={routes.getSignUpRoute()} className={css.ctaButton}>
            Start Free
          </Link>
        </div>

        <div className={css.features}>
          <div className={css.feature}>
            <div className={css.featureIcon}>⏱️</div>
            <h3>Smart Timer</h3>
            <p>
              Track your task completion time and earn bonus time for finishing
              them
            </p>
          </div>
          <div className={css.feature}>
            <div className={css.featureIcon}>📋</div>
            <h3>Easy Task Management</h3>
            <p>
              Create, organize and mark tasks as completed in a user-friendly
              interface
            </p>
          </div>
          <div className={css.feature}>
            <div className={css.featureIcon}>🎯</div>
            <h3>Reward System</h3>
            <p>Get extra time for completing tasks on schedule</p>
          </div>
        </div>
      </main>

      <footer className={css.footer}>
        <div className={css.container}>
          <div className={css.copyright}>
            © {new Date().getFullYear()} Leisure Task. All rights reserved.
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
