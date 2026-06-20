import { Link } from 'react-router-dom';
import { Logo } from '../../../components/Logo';
import { env } from '../../../lib/env';
import { getDemoRoute, getSignInRoute } from '../../../lib/routes';
import css from './index.module.scss';

export const LandingPage = () => {
  const currentYear = new Date().getFullYear();
  const isDemoMode = env.VITE_APP_MODE === 'demo';

  return (
    <div className={css.landing}>
      <header className={css.header}>
        <Logo />
        <nav className={css.nav}>
          <a href="#architecture" className={css.textLink}>
            View architecture
          </a>
          {!isDemoMode && (
            <Link to={getSignInRoute()} className={css.textLink}>
              Sign in
            </Link>
          )}
          <Link to={getDemoRoute()} className={css.demoButton}>
            Open demo
          </Link>
        </nav>
      </header>

      <main className={css.main}>
        <section className={css.hero}>
          <div className={css.heroContent}>
            <h1>Earn your leisure time.</h1>
            <p>
              LeisureTask turns finished work into a visible time budget:
              complete tasks, earn minutes, then spend that time with intent.
            </p>
            <div className={css.heroActions}>
              <Link to={getDemoRoute()} className={css.primaryCta}>
                Open demo
              </Link>
              <a href="#architecture" className={css.secondaryCta}>
                View architecture
              </a>
            </div>
          </div>

          <div className={css.productPreview} aria-hidden="true">
            <div className={css.previewHeader}>
              <div>
                <span>Available time</span>
                <b>2:45:00</b>
              </div>
              <span className={css.livePill}>Demo mode</span>
            </div>
            <div className={css.previewFlow}>
              <div>
                <span>01</span>
                <b>Complete tasks</b>
                <p>Finish meaningful work.</p>
              </div>
              <div>
                <span>02</span>
                <b>Earn minutes</b>
                <p>Add rewards to your balance.</p>
              </div>
              <div>
                <span>03</span>
                <b>Spend time</b>
                <p>Run the leisure timer.</p>
              </div>
            </div>
            <div className={css.previewTasks}>
              <div>
                <span className={css.previewCheck}></span>
                <b>Ship product case study</b>
                <em>+45m</em>
              </div>
              <div>
                <span className={css.previewCheck}></span>
                <b>Write zero-cost deploy guide</b>
                <em>+20m</em>
              </div>
            </div>
          </div>
        </section>

        <section className={css.mechanics}>
          <div>
            <span>Mechanic</span>
            <h2>More than a todo list</h2>
            <p>
              The product links task completion, deadlines, ordering and a
              countdown timer into one personal time-budget loop.
            </p>
          </div>
          <div>
            <span>Demo</span>
            <h2>No backend required</h2>
            <p>
              The static demo opens instantly without a database, backend cold
              starts or third-party services. The full tRPC/Postgres
              implementation remains available in the codebase.
            </p>
          </div>
          <div>
            <span>Stack</span>
            <h2>Full-stack architecture</h2>
            <p>
              React, Vite, TypeScript, tRPC, Prisma, PostgreSQL, Zod and
              optional integrations for uploads, analytics and email.
            </p>
          </div>
        </section>

        <section className={css.architecture} id="architecture">
          <div className={css.architectureCopy}>
            <h2>
              Designed as a real full-stack app, packaged as a free static demo.
            </h2>
            <p>
              The public demo highlights the strongest user flow without forcing
              visitors through database setup, cold starts or external services.
              Fullstack mode still keeps the original auth, API and
              Prisma-backed workflows.
            </p>
          </div>
          <div className={css.stackList}>
            <span>React/Vite UI</span>
            <span>tRPC contracts</span>
            <span>Prisma/Postgres</span>
            <span>JWT auth</span>
            <span>MJML emails</span>
            <span>Cloudinary-ready uploads</span>
          </div>
        </section>
      </main>

      <footer className={css.footer}>
        <div className={css.container}>
          <div className={css.copyright}>
            © {currentYear} LeisureTask. Public demo.
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
