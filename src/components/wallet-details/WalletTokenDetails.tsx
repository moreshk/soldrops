/* eslint-disable @next/next/no-img-element */
import { CompleteToken } from "@/lib/db/schema/tokens";
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";

export const WalletTokenDetails = ({
  walletTokenDetails,
  tokens,
}: {
  walletTokenDetails: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  };
  tokens: CompleteToken[];
}) => {
  const info = walletTokenDetails.account.data.parsed.info;
  const tokenDetails = tokens.find((token) => token.address === info.mint);
  if (tokenDetails) {
    return (
      <div className="bg-secondary p-4 rounded-lg m-4">
        <div className="w-full">
          <div className="flex gap-2 items-center">
            <img
              src={tokenDetails.imageUrl}
              alt="log"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <div>{tokenDetails.symbol}</div>
              <div className="text-sm opacity-60">
                {info.tokenAmount.uiAmountString} {tokenDetails.symbol}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-secondary p-4 rounded-lg m-4">
        <div className="w-full">
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 rounded-full bg-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs">{info.mint}</p>
              <div className="text-sm opacity-60">
                {info.tokenAmount.uiAmountString}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
