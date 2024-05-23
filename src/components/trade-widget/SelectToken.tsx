/* eslint-disable @next/next/no-img-element */
import { CompleteToken } from "@/lib/trpc-api/tokens/tokens.type";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import TokenListModal from "../tokens/TokenListModal";

type SelectTokenProps = {
  tokens: CompleteToken[];
  selectedToken: CompleteToken;
  isLoading: boolean;
  onTokenChange: (token: CompleteToken) => void;
};

export const SelectToken = ({
  isLoading,
  onTokenChange,
  selectedToken,
  tokens,
}: SelectTokenProps) => {
  const [openTokenModal, setOpenTokenModal] = useState(false);
  return (
    <>
      <button
        disabled={isLoading}
        className="rounded-xl cursor-pointer flex gap-3 px-2 py-1.5 border items-center h-12 bg-background disabled:cursor-not-allowed"
        onClick={() => setOpenTokenModal(true)}
      >
        <img
          src={selectedToken.imageUrl}
          alt="logo"
          className="w-5 h-5 rounded-full"
        />
        <div className="flex gap-1 items-center pr-6">
          <p className="font-semibold">{selectedToken.symbol}</p>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <TokenListModal
        selectedToken={selectedToken}
        onChange={setOpenTokenModal}
        open={openTokenModal}
        tokens={tokens}
        onTokenChange={onTokenChange}
      />
    </>
  );
};
