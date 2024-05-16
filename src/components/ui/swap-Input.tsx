/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import TokenListModal from "../tokens/TokenListModal";
import { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import { CompleteToken } from "@/lib/db/schema/tokens";
import { ChevronDown } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  tokens: CompleteToken[];
  selectedToken: CompleteToken;
  inputHeader: ReactNode;
  isLoading: boolean;
  onTokenChange: (token: CompleteToken) => void;
  balance?: string;
}

const SwapInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      tokens,
      isLoading,
      type,
      selectedToken,
      onTokenChange,
      inputHeader,
      balance,
      ...props
    },
    ref
  ) => {
    const [openTokenModal, setOpenTokenModal] = useState(false);
    return (
      <div>
        {inputHeader}
        <div className="relative group border border-input flex rounded-2xl bg-background items-center gap-2 pl-3 h-[72px]">
          <button
            className="rounded-xl cursor-pointer flex gap-3 px-2 py-1.5 border items-center h-12"
            onClick={() => setOpenTokenModal(true)}
          >
            <img
              src={selectedToken.imageUrl}
              alt="logo"
              className="w-5 h-5 rounded-full"
            />
            <div className="flex gap-1 items-center">
              <p className="font-semibold">{selectedToken.symbol}</p>
              <ChevronDown className="w-5 h-5" />
            </div>
          </button>
          <div className="w-full flex-1">
            <input
              type={type}
              className={cn(
                "flex rounded-2xl px-2 flex-1  placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 text-right text-xl bg-background font-medium w-full pr-4",
                className
              )}
              disabled={isLoading}
              placeholder="00.0"
              ref={ref}
              {...props}
            />
            {isLoading && (
              <div className="absolute right-3 top-4 h-10 w-60 bg-secondary rounded-lg" />
            )}
            {props.value && balance && (
              <div className="text-xs text-right pr-2 text-muted-foreground">
                ${balance}
              </div>
            )}
          </div>
          <TokenListModal
            selectedToken={selectedToken}
            onChange={setOpenTokenModal}
            open={openTokenModal}
            tokens={tokens}
            onTokenChange={onTokenChange}
          />
        </div>
      </div>
    );
  }
);
SwapInput.displayName = "SwapInput";

export { SwapInput };
