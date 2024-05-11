import { CompleteToken } from "@/lib/db/schema/tokens";
import { create } from "zustand";
import { produce } from "immer";
import { createSelectors } from "./create-selectors";
import { stableUSDC, solToken } from "@/lib/tokens/utils/defaultTokens";
import { QuoteResponse } from "@jup-ag/api";

export interface SwapState {
  sendToken: CompleteToken;
  sendAmount: string;
  receiveAmount: string;
  receiveToken: CompleteToken;
  quoteResponse?: QuoteResponse;
  inputFocus: "receive" | "send";
  isFetching: "unloaded" | "loaded" | "loading" | "error";
  isSwapping: "unloaded" | "loaded" | "loading" | "error";
  setSendToken: (token: CompleteToken) => void;
  setReceiveToken: (token: CompleteToken) => void;
  onArrayUpDownClick: () => void;
  getQuoteAmount: () => void;
  setSendAmount: (value: string) => void;
  setReceiveAmount: (value: string) => void;
  setFocus: (value: "receive" | "send") => void;
  getQuoteTokenURL: () => string | undefined;
}

export const useSwapStore = create<SwapState>()((set, get) => ({
  sendAmount: "",
  receiveAmount: "",
  inputFocus: "send",
  isSwapping: "unloaded",
  sendToken: solToken,
  receiveToken: stableUSDC,
  quoteResponse: undefined,
  isFetching: "unloaded",
  setSendAmount: (input: string) =>
    set(
      produce((state: SwapState) => {
        state.sendAmount = input.replace(/[^\d.]+/g, "");
      })
    ),
  setFocus: (inputFocus: "receive" | "send") =>
    set(
      produce((state: SwapState) => {
        state.inputFocus = inputFocus;
      })
    ),
  setReceiveAmount: (input: string) =>
    set(
      produce((state: SwapState) => {
        state.receiveAmount = input.replace(/[^\d.]+/g, "");
      })
    ),
  setSendToken: (token: CompleteToken) =>
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
  setReceiveToken: (token: CompleteToken) =>
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
  onArrayUpDownClick: () =>
    set(
      produce((state: SwapState) => {
        const tempSendToken = state.sendToken;
        state.sendToken = state.receiveToken;
        state.receiveToken = tempSendToken;
      })
    ),
  getQuoteAmount: async () => {
    const { sendToken, receiveToken, sendAmount, receiveAmount, inputFocus } =
      get();
    if (
      sendToken &&
      receiveToken &&
      (typeof +sendAmount === "number" || typeof +receiveAmount === "number")
    ) {
      if (+sendAmount > 0 || +receiveAmount > 0) {
        try {
          set(
            produce((state: SwapState) => {
              state.isFetching = "loading";
            })
          );
          let inputMint;
          let outputMint;
          let amount;
          if (inputFocus === "send") {
            inputMint = sendToken;
            outputMint = receiveToken;
            amount = parseFloat(sendAmount) * Math.pow(10, sendToken.decimal);
          }
          if (inputFocus === "receive") {
            inputMint = receiveToken;
            outputMint = sendToken;
            amount =
              parseFloat(receiveAmount) * Math.pow(10, sendToken.decimal);
          }
          const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint?.address}&outputMint=${outputMint?.address}&amount=${amount}&platformFeeBps=100`;
          const response = await fetch(url);
          const quoteResponse = await response.json();
          const quotePrice =
            quoteResponse.outAmount / Math.pow(10, outputMint?.decimal!);
          if (inputFocus === "receive") {
            set(
              produce((state: SwapState) => {
                state.isFetching = "loaded";
                state.sendAmount = quotePrice.toString();
                state.quoteResponse = quoteResponse;
              })
            );
          }
          if (inputFocus === "send") {
            set(
              produce((state: SwapState) => {
                state.isFetching = "loaded";
                state.receiveAmount = quotePrice.toString();
                state.quoteResponse = quoteResponse;
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
    }
  },
  getQuoteTokenURL: () => {
    const { sendToken, receiveToken, sendAmount, receiveAmount, inputFocus } =
      get();
    if (sendToken && receiveToken && (sendAmount || receiveAmount)) {
      let inputMint;
      let outputMint;
      let amount;
      if (inputFocus === "send") {
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
      return url;
    }
  },
}));

export const useSwapStoreSelectors = createSelectors(useSwapStore);
