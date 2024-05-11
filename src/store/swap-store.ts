import { CompleteToken, Token } from "@/lib/db/schema/tokens";
import { create } from "zustand";
import { produce } from "immer";
import { createSelectors } from "./create-selectors";
import { popcatToken, solToken } from "@/lib/tokens/utils/defaultTokens";

type InputFocusType = "receive" | "send" | "unfocused";
export interface SwapState {
  sendToken: CompleteToken;
  sendAmount: string;
  receiveAmount: string;
  receiveToken: CompleteToken;
  inputFocus: InputFocusType;
  isFetching: "unloaded" | "loaded" | "loading" | "error";
  setSendToken: (token: CompleteToken) => void;
  setReceiveToken: (token: CompleteToken) => void;
  swapTokens: () => void;
  fetchTokenAmount: () => void;
  setSendAmount: (value: string) => void;
  setReceiveAmount: (value: string) => void;
  setFocus: (value: InputFocusType) => void;
}

export const useSwapStore = create<SwapState>()((set, get) => ({
  sendAmount: "",
  receiveAmount: "",
  inputFocus: "unfocused",
  sendToken: solToken,
  receiveToken: popcatToken,
  isFetching: "unloaded",
  setSendAmount: (input: string) =>
    set(
      produce((state: SwapState) => {
        state.sendAmount = input.replace(/[^0-9]/g, "");
      })
    ),
  setFocus: (inputFocus: InputFocusType) =>
    set(
      produce((state: SwapState) => {
        state.inputFocus = inputFocus;
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
  fetchTokenAmount: async () => {
    const { sendToken, receiveToken, sendAmount, receiveAmount, inputFocus } =
      get();
    if (sendToken && receiveToken && (sendAmount || receiveAmount)) {
      try {
        set(
          produce((state: SwapState) => {
            state.isFetching = "loading";
          })
        );
        let inputMint;
        let outputMint;
        let amount;
        if (inputFocus === "send" || inputFocus === "unfocused") {
          inputMint = sendToken;
          outputMint = receiveToken;
          amount = parseFloat(sendAmount) * Math.pow(10, sendToken.decimal);
        }
        if (inputFocus === "receive") {
          inputMint = receiveToken;
          outputMint = sendToken;
          amount = parseFloat(receiveAmount) * Math.pow(10, sendToken.decimal);
        }
        const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint?.address}&outputMint=${outputMint?.address}&amount=${amount}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.outAmount) {
          const quotePrice =
            data.outAmount / Math.pow(10, outputMint?.decimal!);
          if (inputFocus === "receive") {
            set(
              produce((state: SwapState) => {
                state.isFetching = "loaded";
                state.sendAmount = quotePrice.toString();
              })
            );
          }
          if (inputFocus === "send" || inputFocus === "unfocused") {
            set(
              produce((state: SwapState) => {
                state.isFetching = "loaded";
                state.receiveAmount = quotePrice.toString();
              })
            );
          }
        } else {
          set(
            produce((state: SwapState) => {
              state.isFetching = "error";
            })
          );
        }
      } catch (e) {
        set(
          produce((state: SwapState) => {
            state.isFetching = "error";
          })
        );
      }
    }
  },
}));

export const useSwapStoreSelectors = createSelectors(useSwapStore);
