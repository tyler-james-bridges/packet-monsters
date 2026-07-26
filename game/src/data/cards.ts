import raw from '../../../data/cards.json';
import type { CardRecord, TypeName } from '../core/types';
import { TYPE_NAMES } from '../core/types';

export const CARDS: CardRecord[] = raw as CardRecord[];

export function typeNameOf(card: CardRecord): TypeName {
  return TYPE_NAMES[card.typeId] ?? 'EXOTIC';
}

/** Human label for a network CAIP-2 id or plain chain name. */
export function networkLabel(network: string): string {
  const map: Record<string, string> = {
    'eip155:8453': 'BASE',
    'eip155:1': 'ETHEREUM',
    'eip155:137': 'POLYGON',
    'eip155:43114': 'AVALANCHE',
    'eip155:84532': 'BASE SEPOLIA',
  };
  return map[network] ?? network.toUpperCase().replace(/^EIP155:/, 'CHAIN ');
}

export function priceOf(card: CardRecord): number {
  const n = Number.parseFloat(card.priceUsd);
  return Number.isFinite(n) ? n : 0;
}
