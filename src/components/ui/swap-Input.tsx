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
      ...props
    },
    ref
  ) => {
    const [openTokenModal, setOpenTokenModal] = useState(false);
    return (
      <div>
        {inputHeader}
        <div className="relative group">
          <button
            className="absolute left-3 rounded-xl cursor-pointer h-full"
            onClick={() => setOpenTokenModal(true)}
          >
            <div className="flex gap-3 group-hover:bg-background rounded-xl px-2 py-1.5 border items-center h-11">
              <img
                src={selectedToken.imageUrl}
                alt="logo"
                className="w-5 h-5 rounded-full"
              />
              <div className="flex gap-1 items-center">
                <p className="font-semibold">{selectedToken.symbol}</p>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </button>
          <input
            type={type}
            className={cn(
              "flex h-[72px] w-full rounded-2xl border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right text-xl font-medium group-hover:bg-secondary group-active:bg-secondary group-focus-within:bg-secondary",
              className
            )}
            disabled={isLoading}
            placeholder="00.0"
            ref={ref}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-3 top-4 h-10 w-36 bg-secondary rounded-2xl animate-pulse" />
          )}
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
