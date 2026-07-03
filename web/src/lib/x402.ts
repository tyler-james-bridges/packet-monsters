// x402 V2 payment-required shape (SPEC.md). Shared between client and server,
// no node-only imports here.

export interface PaymentRequirements {
  scheme: "exact";
  network: string; // "eip155:31337"
  asset: `0x${string}`;
  payTo: `0x${string}`;
  maxAmountRequired: string; // base units, string per x402 convention
  description: string;
  resource?: string;
}

export interface X402PaymentRequiredBody {
  x402Version: 2;
  accepts: PaymentRequirements[];
}

// Path (a): EIP-3009 transferWithAuthorization signature.
export interface Eip3009Payment {
  kind: "eip3009";
  from: `0x${string}`;
  to: `0x${string}`;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: `0x${string}`;
  v: number;
  r: `0x${string}`;
  s: `0x${string}`;
}

// Path (b, default): direct transfer tx, proven by hash.
export interface TransferPayment {
  kind: "transfer";
  txHash: `0x${string}`;
}

export type PaymentPayload = Eip3009Payment | TransferPayment;

export function encodePaymentRequired(body: X402PaymentRequiredBody): string {
  return Buffer.from(JSON.stringify(body)).toString("base64");
}

export function decodePaymentRequired(header: string): X402PaymentRequiredBody {
  return JSON.parse(Buffer.from(header, "base64").toString("utf-8"));
}

export function encodePayment(payload: PaymentPayload): string {
  const json = JSON.stringify(payload);
  if (typeof window === "undefined") {
    return Buffer.from(json).toString("base64");
  }
  return btoa(json);
}

export function decodePayment(header: string): PaymentPayload {
  const json =
    typeof window === "undefined"
      ? Buffer.from(header, "base64").toString("utf-8")
      : atob(header);
  return JSON.parse(json);
}
