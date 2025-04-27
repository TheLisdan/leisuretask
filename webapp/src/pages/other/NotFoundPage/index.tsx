import css from './index.module.scss';

export const NotFoundPage = () => {
  return (
    <div className={css.errorContainer}>
      <h1 className={css.bigText}>
        <b>404</b>
      </h1>
      <b>Page not found</b>
    </div>
  );
};
