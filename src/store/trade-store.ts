import { CompleteToken } from "@/lib/db/schema/tokens";
import { create } from "zustand";
import { produce } from "immer";
import { createSelectors } from "./create-selectors";
import { stableUSDC, solToken } from "@/lib/tokens/utils/defaultTokens";
import { QuoteResponse } from "@jup-ag/api";
import { IsFetchingEnum } from "./store-types";

export interface TradeStoreState {
  sendToken: CompleteToken;
  sendAmount: string;
  receiveAmount: string;
  insufficientSendBalance: boolean;
  receiveToken: CompleteToken;
  quoteResponse?: QuoteResponse;
  sendBalance: string;
  amountInput: string;
  isLoggedIn: boolean;
  receiveBalance: string;
  isFetching: IsFetchingEnum;
  isSwapping: IsFetchingEnum;
  setSendToken: (token: CompleteToken) => void;
  setReceiveToken: (token: CompleteToken) => void;
  onArrayUpDownClick: () => void;
  getQuoteAmount: () => void;
  setSendAmount: (value: string) => void;
  setAmountInput: (value: string) => void;
  setReceiveAmount: (value: string) => void;
  setLoggedIn: (value: boolean) => void;
  getQuoteTokenURL: () => string | undefined;
  getBalance: () => void;
}

export const useTradeStore = create<TradeStoreState>()((set, get) => ({
  isLoggedIn: false,
  sendAmount: "",
  amountInput: "",
  receiveAmount: "",
  sendBalance: "",
  receiveBalance: "",
  insufficientSendBalance: false,
  isSwapping: IsFetchingEnum.unloaded,
  sendToken: solToken,
  receiveToken: stableUSDC,
  quoteResponse: undefined,
  isFetching: IsFetchingEnum.unloaded,
  setLoggedIn: (value: boolean) =>
    set(
      produce((state: TradeStoreState) => {
        state.isLoggedIn = value;
      })
    ),
  setSendAmount: (input: string) =>
    set(
      produce((state: TradeStoreState) => {
        state.sendAmount = input.replace(/[^\d.]+/g, "");
      })
    ),
  setAmountInput: (input: string) =>
    set(
      produce((state: TradeStoreState) => {
        state.amountInput = input.replace(/[^\d.]+/g, "");
      })
    ),
  setReceiveAmount: (input: string) =>
    set(
      produce((state: TradeStoreState) => {
        state.receiveAmount = input.replace(/[^\d.]+/g, "");
      })
    ),
  setSendToken: (token: CompleteToken) =>
    set(
      produce((state: TradeStoreState) => {
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
      produce((state: TradeStoreState) => {
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
      produce((state: TradeStoreState) => {
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
    const { sendToken, receiveToken, amountInput, isLoggedIn } = get();
    if (+amountInput) {
      try {
        set(
          produce((state: TradeStoreState) => {
            state.isFetching = IsFetchingEnum.loading;
          })
        );
        const amountUSDC =
          parseFloat(amountInput) * Math.pow(10, stableUSDC.decimal);

        const UsdToSOlUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${stableUSDC.address}&outputMint=${sendToken.address}&amount=${amountUSDC}`;
        const usdcResponse = await fetch(UsdToSOlUrl);
        const usdcQuoteResponse: QuoteResponse = await usdcResponse.json();

        const url = `https://quote-api.jup.ag/v6/quote?inputMint=${sendToken.address}&outputMint=${receiveToken.address}&amount=${usdcQuoteResponse.outAmount}&platformFeeBps=100`;
        const response = await fetch(url);
        const quoteResponse: QuoteResponse = await response.json();
        const sendAmount =
          +usdcQuoteResponse.outAmount / Math.pow(10, sendToken.decimal);
        const receiveAmount =
          +quoteResponse.outAmount / Math.pow(10, receiveToken.decimal);
        let sendBal: string;
        let receiveBal: string;
        if (isLoggedIn) {
          const { ataTokenBalance, solBalance } =
            await window.trpc.tokens.getSwapTokenBalance.query({
              id:
                sendToken.address === solToken.address
                  ? receiveToken.address
                  : sendToken.address,
            });
          sendBal =
            sendToken.address === solToken.address
              ? `${solBalance / Math.pow(10, sendToken.decimal)}`
              : `${+ataTokenBalance}`;
          receiveBal =
            receiveToken.address === solToken.address
              ? `${solBalance / Math.pow(10, receiveToken.decimal)}`
              : `${+ataTokenBalance}`;
        }
        set(
          produce((state: TradeStoreState) => {
            state.isFetching = IsFetchingEnum.loaded;
            state.receiveAmount = `${receiveAmount}`;
            state.sendAmount = `${sendAmount}`;
            state.sendBalance = sendBal || "0";
            state.receiveBalance = receiveBal || "0";
          })
        );
      } catch (error) {
        console.error(error);
        set(
          produce((state: TradeStoreState) => {
            state.isFetching = IsFetchingEnum.error;
          })
        );
      }
    }
  },
  getQuoteTokenURL: () => {
    const { sendToken, receiveToken, amountInput, sendAmount } = get();
    if (+amountInput) {
      const amount = parseFloat(sendAmount) * Math.pow(10, sendToken.decimal);
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${sendToken.address}&outputMint=${receiveToken.address}&amount=${amount}`;
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
        produce((state: TradeStoreState) => {
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

export const useTradeStoreSelectors = createSelectors(useTradeStore);
