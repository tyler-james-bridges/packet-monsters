import { BaseError, ContractFunctionRevertedError } from "viem";

// Rule 7: never surface raw revert data. Translate to a human message.
export function parseContractError(error: unknown): string {
  if (error instanceof BaseError) {
    const revert = error.walk(
      (e) => e instanceof ContractFunctionRevertedError,
    );
    if (revert instanceof ContractFunctionRevertedError) {
      const reason =
        revert.reason ?? revert.data?.errorName ?? "transaction reverted";
      return translateReason(reason);
    }
    const message = error.shortMessage.toLowerCase();
    if (message.includes("fetch") || message.includes("http request failed")) {
      return "Cannot reach the local chain. Is anvil running on 127.0.0.1:8545?";
    }
    if (message.includes("insufficient funds")) {
      return "Not enough ETH for gas. Hit the faucet to fund your burner.";
    }
    return translateReason(error.shortMessage);
  }
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes("fetch")) {
      return "Network request failed. Check that the dev server and anvil are running.";
    }
    return error.message;
  }
  return "Something went wrong. Try again.";
}

function translateReason(reason: string): string {
  const r = reason.toLowerCase();
  if (r.includes("insufficient") && r.includes("balance")) {
    return "Insufficient USDC balance. Hit the faucet to fund your burner.";
  }
  if (r.includes("not owner") || r.includes("caller")) {
    return "You must own one of the battling cards.";
  }
  if (r.includes("nonexistent") || r.includes("invalid token")) {
    return "That token does not exist.";
  }
  return reason;
}
