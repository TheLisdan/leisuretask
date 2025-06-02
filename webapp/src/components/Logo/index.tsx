import cs from 'classnames';
import { Link } from 'react-router-dom';
import { TimerLogo } from '../../../assets/timer-logo';
import { routes } from '../../lib/routes';
import css from './index.module.scss';

export const Logo = ({ marginBottom = false }: { marginBottom?: boolean }) => (
  <Link
    to={routes.getLandingRoute()}
    className={cs(css.logo, { [css.marginBottom]: marginBottom })}
  >
    <TimerLogo />
    LeisureTask
  </Link>
);
