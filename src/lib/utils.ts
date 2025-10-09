import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a blockchain explorer URL for a wallet address
 * @param address Wallet address
 * @param tab Optional tab to open (e.g., 'token_transfers', 'transactions')
 * @returns Full URL to the blockchain explorer for this address
 */
export function getExplorerAddressUrl(address: string, tab: string = 'token_transfers'): string {
  const explorerUrl = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL || 'https://blockscout.lisk.com';
  return `${explorerUrl}/address/${address}${tab ? `?tab=${tab}` : ''}`;
}

/**
 * Generates a blockchain explorer URL for a transaction
 * @param txHash Transaction hash
 * @returns Full URL to the blockchain explorer for this transaction
 */
export function getExplorerTransactionUrl(txHash: string): string {
  const explorerUrl = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL || 'https://blockscout.lisk.com';
  return `${explorerUrl}/tx/${txHash}`;
}

/**
 * Generates a blockchain explorer URL for an NFT token
 * @param tokenId Token ID
 * @param contractAddress NFT contract address
 * @returns Full URL to the blockchain explorer for this token
 */
export function getExplorerNftUrl(tokenId: string | number, contractAddress: string): string {
  const explorerUrl = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL || 'https://blockscout.lisk.com';
  return `${explorerUrl}/token/${contractAddress}/instance/${tokenId}`;
}
