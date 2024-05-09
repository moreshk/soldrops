import { cn } from "@/lib/utils";
import TokenListModal from "../tokens/TokenListModal";
import { Button } from "./button";
import { InputHTMLAttributes, forwardRef, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const SwapInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [openTokenModal, setOpenTokenModal] = useState(false);
    return (
      <div>
        <div className="relative group">
          <Button
            className="absolute translate-y-[30%] left-3 rounded-xl"
            onClick={() => setOpenTokenModal(true)}
          >
            Token
          </Button>
          <input
            type={type}
            className={cn(
              "flex h-16 w-full rounded-2xl border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-right text-xl font-medium group-hover:bg-secondary group-active:bg-secondary group-focus-within:bg-secondary",
              className
            )}
            ref={ref}
            {...props}
          />
          <TokenListModal onChange={setOpenTokenModal} open={openTokenModal} />
        </div>
      </div>
    );
  }
);
SwapInput.displayName = "SwapInput";

export { SwapInput };
