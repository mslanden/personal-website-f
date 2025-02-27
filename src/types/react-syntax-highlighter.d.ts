declare module 'react-syntax-highlighter' {
  import { ComponentType } from 'react';

  export const Prism: ComponentType<any>;
  export const dark: any;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const dark: any;
  export { dark };
}
