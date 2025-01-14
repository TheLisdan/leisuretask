/// <reference types="vite/client" />
declare module '*.scss' {
  type IClassNames = {
    [className: string]: string;
  };
  const classNames: IClassNames;
  export = classNames;
}
