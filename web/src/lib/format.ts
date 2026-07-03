import { formatEther, formatUnits } from "viem";
import { USDC_DECIMALS } from "./config";

export function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// MockUSDC is dollar-pegged, so the USD context is the amount itself.
export function formatUsdc(units: bigint): string {
  const value = Number(formatUnits(units, USDC_DECIMALS));
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatEth(wei: bigint): string {
  const value = Number(formatEther(wei));
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 4,
  })} ETH`;
}
