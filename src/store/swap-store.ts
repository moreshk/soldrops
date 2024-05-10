import { CompleteToken, Token } from "@/lib/db/schema/tokens";
import { create } from "zustand";
import { produce } from "immer";
import { createSelectors } from "./create-selectors";
import { popcatToken, solToken } from "@/lib/tokens/utils/defaultTokens";

export interface SwapState {
  sendToken: CompleteToken;
  sendAmount: string;
  receiveAmount: string;
  receiveToken: CompleteToken;
  isFetching: "unloaded" | "loaded" | "loading" | "error";
  setSendToken: (token: CompleteToken) => void;
  setReceiveToken: (token: CompleteToken) => void;
  swapTokens: () => void;
  fetchTokenDetails: () => void;
  setSendAmount: (value: string) => void;
  setReceiveAmount: (value: string) => void;
}

export const useSwapStore = create<SwapState>()((set) => ({
  sendAmount: "",
  receiveAmount: "",
  sendToken: solToken,
  receiveToken: popcatToken,
  isFetching: "unloaded",
  setSendAmount: (input: string) =>
    set(
      produce((state: SwapState) => {
        state.sendAmount = input.replace(/[^0-9]/g, "");
      })
    ),
  setReceiveAmount: (input: string) =>
    set(
      produce((state: SwapState) => {
        state.receiveAmount = input.replace(/[^0-9]/g, "");
      })
    ),
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
