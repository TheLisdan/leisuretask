const appRoute = '/app';

export const getLandingRoute = () => '/';
export const getHomeRoute = () => `${appRoute}/home`;
export const getSignUpRoute = () => '/sign-up';
export const getSignInRoute = () => '/sign-in';
export const getSignOutRoute = () => '/sign-out';

export const routes = {
  getLandingRoute,
  getHomeRoute,
  getSignUpRoute,
  getSignInRoute,
  getSignOutRoute,
};
