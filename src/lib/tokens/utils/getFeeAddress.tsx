import { Connection, PublicKey } from "@solana/web3.js";
import {
  // @ts-ignore
  createAssociatedTokenAccountInstruction,
  // @ts-ignore
  getAssociatedTokenAddress,
} from "@solana/spl-token";

export const getFeeAddress = async (
  connection: Connection,
  walletAddress: PublicKey,
  mint: PublicKey,
  payer: PublicKey
) => {
  const ata = await getAssociatedTokenAddress(mint, walletAddress);
  const info = await connection.getAccountInfo(ata);

  if (!info || !info.data) {
    const ix = createAssociatedTokenAccountInstruction(
      payer,
      ata,
      walletAddress,
      mint
    );
    return { pubkey: ata, ix };
  }

  return { pubkey: ata, ix: undefined };
};
