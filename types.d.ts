import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom attributes here
  }
}

declare module 'styled-components' {
  export interface DefaultTheme {
    // Add your theme properties here
  }
} 