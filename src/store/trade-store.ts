import { CompleteToken } from "@/lib/trpc-api/tokens/tokens.type";

import { create } from "zustand";
import { produce } from "immer";
import { createSelectors } from "./create-selectors";
import { stableUSDC, solToken } from "@/utils/defaultTokens";
import { QuoteResponse } from "@jup-ag/api";
import { IsFetchingEnum } from "./store-types";
import { getSwapTokenBalance } from "./store-utils/getSwapTokenBalance";
import { fetchAnyTokenToUSDValue } from "./store-utils/fetchAnyTokenToUSDValue";
import { fetchUSDToAnyTokenValue } from "./store-utils/fetchUSDToAnyTokenValue";
import { fetchSwapValue } from "./store-utils/fetchSwapValue";

export interface TradeStoreState {
  sendToken: CompleteToken;
  sendAmount: string;
  receiveAmount: string;
  insufficientSendBalance: boolean;
  receiveToken: CompleteToken;
  quoteResponse?: QuoteResponse;
  sendBalance: string;
  amountInput: string;
  sendBalanceInUSDC: string;
  receiveBalanceInUSDC: string;
  isLoggedIn: boolean;
  receiveBalance: string;
  isFetching: IsFetchingEnum;
  isSwapping: IsFetchingEnum;
  setSendToken: (token: CompleteToken) => void;
  setReceiveToken: (token: CompleteToken) => void;
  onArrayUpDownClick: () => void;
  getQuoteAmount: () => void;
  setAmountInput: (value: string) => void;
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
  sendBalanceInUSDC: "",
  receiveBalanceInUSDC: "",
  setLoggedIn: (value: boolean) =>
    set(
      produce((state: TradeStoreState) => {
        state.isLoggedIn = value;
      })
    ),
  setAmountInput: (input: string) =>
    set(
      produce((state: TradeStoreState) => {
        state.amountInput = input.replace(/[^\d.]+/g, "");
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
        const tempSendBalanceUSDC = state.sendBalanceInUSDC;

        state.sendToken = state.receiveToken;
        state.receiveToken = tempSendToken;

        state.sendAmount = state.receiveAmount;
        state.receiveAmount = tempSendAmount;

        state.sendBalanceInUSDC = state.receiveBalanceInUSDC;
        state.receiveBalanceInUSDC = tempSendBalanceUSDC;

        state.sendBalance = state.receiveBalance;
        state.receiveBalance = tempSendBalance;
      })
    ),

  getQuoteAmount: async () => {
    const { sendToken, receiveToken, amountInput, isLoggedIn, getBalance } =
      get();
    if (+amountInput) {
      try {
        set(
          produce((state: TradeStoreState) => {
            state.isFetching = IsFetchingEnum.loading;
          })
        );
        const { amount: sendAmount } = await fetchUSDToAnyTokenValue(
          sendToken,
          amountInput
        );
        const { amount: receiveAmount } = await fetchSwapValue(
          sendToken,
          receiveToken,
          sendAmount
        );

        let sendBalance: string = "0";
        let receiveBalance: string = "0";
        if (isLoggedIn) {
          const { receiveTokenBalance, sendTokenBalance } =
            await getSwapTokenBalance(sendToken, receiveToken);
          sendBalance = sendTokenBalance;
          receiveBalance = receiveTokenBalance;
        }
        const { amount: sendBalanceInUSDC } = await fetchAnyTokenToUSDValue(
          sendToken,
          sendBalance
        );
        set(
          produce((state: TradeStoreState) => {
            state.isFetching = IsFetchingEnum.loaded;
            state.receiveAmount = receiveAmount;
            state.sendAmount = sendAmount;
            state.sendBalance = sendBalance;
            state.receiveBalance = receiveBalance;
            state.sendBalanceInUSDC = sendBalanceInUSDC;
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
    } else {
      getBalance();
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
      const { receiveTokenBalance, sendTokenBalance } =
        await getSwapTokenBalance(sendToken, receiveToken);
      const { amount: sendBalanceUsdc } = await fetchAnyTokenToUSDValue(
        sendToken,
        sendTokenBalance
      );
      const { amount: receiveBalanceUsdc } = await fetchAnyTokenToUSDValue(
        receiveToken,
        receiveTokenBalance
      );
      set(
        produce((state: TradeStoreState) => {
          state.sendBalance = sendTokenBalance;
          state.receiveBalance = receiveTokenBalance;
          state.receiveBalanceInUSDC = receiveBalanceUsdc;
          state.sendBalanceInUSDC = sendBalanceUsdc;
        })
      );
    } catch (e) {
      console.error(e);
    }
  },
}));

export const useTradeStoreSelectors = createSelectors(useTradeStore);
