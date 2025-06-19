/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />

declare module 'styled-components' {
  export interface DefaultTheme {
    // Add your theme properties here
  }

  export const div: any;
  export const span: any;
  export const button: any;
  export const input: any;
  export const textarea: any;
  export const a: any;
  export const img: any;
  export const p: any;
  export const h1: any;
  export const h2: any;
  export const h3: any;
  export const h4: any;
  export const h5: any;
  export const h6: any;
}

declare module 'use-immer' {
  import { Dispatch } from 'react';
  import { Draft } from 'immer';

  export function useImmerReducer<S, A>(
    reducer: (draft: Draft<S>, action: A) => void | S,
    initialState: S
  ): [S, Dispatch<A>];
} 