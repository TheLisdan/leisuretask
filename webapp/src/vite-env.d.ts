/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/consistent-type-definitions */

interface ImportMetaEnv {
  readonly HOST_ENV?: 'local' | 'production';
  readonly VITE_HOST_ENV?: 'local' | 'production';
  readonly VITE_APP_MODE?: 'demo' | 'fullstack';
  readonly VITE_BACKEND_TRPC_URL?: string;
  readonly VITE_WEBAPP_URL?: string;
  readonly VITE_WEBAPP_SENTRY_DSN?: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_MIXPANEL_API_KEY?: string;
  readonly SOURCE_VERSION?: string;
}
declare module '*.scss' {
  type IClassNames = {
    [className: string]: string;
  };
  const classNames: IClassNames;
  export = classNames;
}
