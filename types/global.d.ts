/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />

declare module "use-immer" {
  import { Draft } from "immer";
  import { Dispatch } from "react";

  export function useImmerReducer<S, A>(
    reducer: (draft: Draft<S>, action: A) => void | S,
    initialState: S
  ): [S, Dispatch<A>];
}
