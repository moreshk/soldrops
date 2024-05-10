import { CompleteToken, Token } from "@/lib/db/schema/tokens";
import { create } from "zustand";
import { produce } from "immer";
import { createSelectors } from "./create-selectors";
import { popcatToken, solToken } from "@/lib/tokens/utils/defaultTokens";

export interface SwapState {
  sendToken: CompleteToken;
  receiveToken: CompleteToken;
  isFetching: "unloaded" | "loaded" | "loading" | "error";
  setSendToken: (token: CompleteToken) => void;
  setReceiveToken: (token: CompleteToken) => void;
  swapTokens: () => void;
  fetchTokenDetails: () => void;
}

export const useSwapStore = create<SwapState>()((set) => ({
  sendToken: solToken,
  receiveToken: popcatToken,
  isFetching: "unloaded",
  setSendToken: (token: Token) =>
    set(
      produce((state: SwapState) => {
        if (!(token.address === state.sendToken.address)) {
          const tempSendToken = state.sendToken;
          if (token.address === solToken.address) {
            state.receiveToken = tempSendToken;
            state.sendToken = solToken;
          } else {
            state.sendToken = token;
            state.receiveToken = solToken;
          }
        }
      })
    ),
  setReceiveToken: (token: Token) =>
    set(
      produce((state: SwapState) => {
        if (!(token.address === state.receiveToken.address)) {
          const tempReceiveToken = state.receiveToken;
          if (token.address === solToken.address) {
            state.sendToken = tempReceiveToken;
            state.receiveToken = solToken;
          } else {
            state.receiveToken = token;
            state.sendToken = solToken;
          }
        }
      })
    ),
  swapTokens: () =>
    set(
      produce((state: SwapState) => {
        const tempSendToken = state.sendToken;
        state.sendToken = state.receiveToken;
        state.receiveToken = tempSendToken;
      })
    ),
  fetchTokenDetails: async () => {
    set(
      produce((state: SwapState) => {
        state.isFetching = "loading";
      })
    );
    try {
      set(
        produce((state: SwapState) => {
          state.isFetching = "loaded";
        })
      );
    } catch (e) {
      console.log(e);
    }
  },
}));

export const useSwapStoreSelectors = createSelectors(useSwapStore);
