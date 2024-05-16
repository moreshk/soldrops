import { CompleteToken } from "@/lib/db/schema/tokens";
import { create } from "zustand";
import { produce } from "immer";
import { createSelectors } from "./create-selectors";
import { stableUSDC, solToken } from "@/lib/tokens/utils/defaultTokens";
import { QuoteResponse } from "@jup-ag/api";

enum IsFetchingEnum {
  unloaded = "unloaded",
  loaded = "loaded",
  loading = "loading",
  error = "error",
}

export enum InputFocusEnum {
  receive = "receive",
  send = "send",
}
export interface SwapState {
  sendToken: CompleteToken;
  sendAmount: string;
  receiveAmount: string;
  receiveToken: CompleteToken;
  quoteResponse?: QuoteResponse;
  sendBalance: string;
  receiveBalance: string;
  inputFocus: InputFocusEnum;
  isFetching: IsFetchingEnum;
  isSwapping: IsFetchingEnum;
  setSendToken: (token: CompleteToken) => void;
  setReceiveToken: (token: CompleteToken) => void;
  onArrayUpDownClick: () => void;
  getQuoteAmount: () => void;
  setSendAmount: (value: string) => void;
  setReceiveAmount: (value: string) => void;
  setFocus: (value: InputFocusEnum) => void;
  getQuoteTokenURL: () => string | undefined;
  getBalance: () => void;
}

export const useSwapStore = create<SwapState>()((set, get) => ({
  sendAmount: "",
  receiveAmount: "",
  sendBalance: "",
  receiveBalance: "",
  inputFocus: InputFocusEnum.send,
  isSwapping: IsFetchingEnum.unloaded,
  sendToken: solToken,
  receiveToken: stableUSDC,
  quoteResponse: undefined,
  isFetching: IsFetchingEnum.unloaded,
  setSendAmount: (input: string) =>
    set(
      produce((state: SwapState) => {
        state.sendAmount = input.replace(/[^\d.]+/g, "");
      })
    ),
  setFocus: (inputFocus: InputFocusEnum) =>
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
        const tempSendAmount = state.sendAmount;
        const tempSendBalance = state.sendBalance;

        state.sendToken = state.receiveToken;
        state.receiveToken = tempSendToken;
        state.sendAmount = state.receiveAmount;
        state.receiveAmount = tempSendAmount;
        state.sendBalance = state.receiveBalance;
        state.receiveBalance = tempSendBalance;
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
              state.isFetching = IsFetchingEnum.loading;
            })
          );
          let inputMint;
          let outputMint;
          let amount;
          if (inputFocus === InputFocusEnum.send) {
            inputMint = sendToken;
            outputMint = receiveToken;
            amount = parseFloat(sendAmount) * Math.pow(10, sendToken.decimal);
          }
          if (inputFocus === InputFocusEnum.receive) {
            inputMint = receiveToken;
            outputMint = sendToken;
            amount =
              parseFloat(receiveAmount) * Math.pow(10, receiveToken.decimal);
          }
          const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint?.address}&outputMint=${outputMint?.address}&amount=${amount}&platformFeeBps=100`;
          const response = await fetch(url);
          const quoteResponse = await response.json();
          const quotePrice =
            quoteResponse.outAmount / Math.pow(10, outputMint?.decimal!);
          const { ataTokenBalance, solBalance } =
            await window.trpc.tokens.getSwapTokenBalance.query({
              id:
                sendToken.address === solToken.address
                  ? receiveToken.address
                  : sendToken.address,
            });

          if (inputFocus === InputFocusEnum.receive) {
            set(
              produce((state: SwapState) => {
                state.isFetching = IsFetchingEnum.loaded;
                state.sendAmount = quotePrice.toString();
                state.quoteResponse = quoteResponse;
                state.sendBalance =
                  sendToken.address === solToken.address
                    ? `${solBalance / Math.pow(10, sendToken.decimal)}`
                    : `${+ataTokenBalance / Math.pow(10, sendToken.decimal)}`;
                state.receiveBalance =
                  receiveToken.address === solToken.address
                    ? `${solBalance / Math.pow(10, receiveToken.decimal)}`
                    : `${
                        +ataTokenBalance / Math.pow(10, receiveToken.decimal)
                      }`;
              })
            );
          }
          if (inputFocus === InputFocusEnum.send) {
            set(
              produce((state: SwapState) => {
                state.isFetching = IsFetchingEnum.loaded;
                state.receiveAmount = quotePrice.toString();
                state.quoteResponse = quoteResponse;
                state.sendBalance =
                  sendToken.address === solToken.address
                    ? `${solBalance / Math.pow(10, sendToken.decimal)}`
                    : `${+ataTokenBalance / Math.pow(10, sendToken.decimal)}`;
                state.receiveBalance =
                  receiveToken.address === solToken.address
                    ? `${solBalance / Math.pow(10, receiveToken.decimal)}`
                    : `${
                        +ataTokenBalance / Math.pow(10, receiveToken.decimal)
                      }`;
              })
            );
          }
        } catch (e) {
          set(
            produce((state: SwapState) => {
              state.isFetching = IsFetchingEnum.error;
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
      if (inputFocus === InputFocusEnum.send) {
        inputMint = sendToken;
        outputMint = receiveToken;
        amount = parseFloat(sendAmount) * Math.pow(10, sendToken.decimal);
      }
      if (inputFocus === InputFocusEnum.receive) {
        inputMint = receiveToken;
        outputMint = sendToken;
        amount = parseFloat(receiveAmount) * Math.pow(10, sendToken.decimal);
      }
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint?.address}&outputMint=${outputMint?.address}&amount=${amount}`;
      return url;
    }
  },
  getBalance: async () => {
    try {
      const { sendToken, receiveToken } = get();
      const { ataTokenBalance, solBalance } =
        await window.trpc.tokens.getSwapTokenBalance.query({
          id:
            sendToken.address === solToken.address
              ? receiveToken.address
              : sendToken.address,
        });
      set(
        produce((state: SwapState) => {
          state.sendBalance =
            sendToken.address === solToken.address
              ? `${solBalance / Math.pow(10, sendToken.decimal)}`
              : `${+ataTokenBalance / Math.pow(10, sendToken.decimal)}`;
          state.receiveBalance =
            receiveToken.address === solToken.address
              ? `${solBalance / Math.pow(10, receiveToken.decimal)}`
              : `${+ataTokenBalance / Math.pow(10, receiveToken.decimal)}`;
        })
      );
    } catch (e) {
      console.error(e);
    }
  },
}));

export const useSwapStoreSelectors = createSelectors(useSwapStore);
