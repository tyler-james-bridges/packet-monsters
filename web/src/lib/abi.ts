// Hand-written from the frozen contract interface in SPEC.md.

export const packetMonstersAbi = [
  {
    type: "function",
    name: "mintPack",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "seed", type: "uint256" },
    ],
    outputs: [{ name: "tokenIds", type: "uint256[3]" }],
  },
  {
    type: "function",
    name: "battle",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenA", type: "uint256" },
      { name: "tokenB", type: "uint256" },
    ],
    outputs: [{ name: "winner", type: "uint256" }],
  },
  {
    type: "function",
    name: "cardOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        name: "def",
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "host", type: "string" },
          { name: "urlHash", type: "bytes32" },
          { name: "hp", type: "uint8" },
          { name: "attack", type: "uint8" },
          { name: "speed", type: "uint8" },
          { name: "typeId", type: "uint8" },
          { name: "rarity", type: "uint8" },
          { name: "alive", type: "bool" },
        ],
      },
      {
        name: "card",
        type: "tuple",
        components: [
          { name: "defId", type: "uint16" },
          { name: "level", type: "uint8" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "event",
    name: "PackOpened",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenIds", type: "uint256[3]", indexed: false },
      { name: "seed", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BattleResult",
    inputs: [
      { name: "tokenA", type: "uint256", indexed: true },
      { name: "tokenB", type: "uint256", indexed: true },
      { name: "winner", type: "uint256", indexed: false },
      { name: "seed", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;

export const mockUsdcAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    // EIP-3009 canonical (v, r, s) variant
    type: "function",
    name: "transferWithAuthorization",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

// Minimal ERC-8004 ReputationRegistry feedback event. The contracts agent owns
// the real definition; we query for both plausible shapes and merge results.
export const newFeedbackEventSimple = {
  type: "event",
  name: "NewFeedback",
  inputs: [
    { name: "agentId", type: "uint256", indexed: true },
    { name: "client", type: "address", indexed: true },
    { name: "value", type: "uint8", indexed: false },
    { name: "tag", type: "string", indexed: false },
  ],
} as const;

export const newFeedbackEvent8004 = {
  type: "event",
  name: "NewFeedback",
  inputs: [
    { name: "agentId", type: "uint256", indexed: true },
    { name: "clientAddress", type: "address", indexed: true },
    { name: "score", type: "uint8", indexed: false },
    { name: "tag1", type: "bytes32", indexed: true },
    { name: "tag2", type: "bytes32", indexed: false },
    { name: "fileuri", type: "string", indexed: false },
  ],
} as const;

// Minimal ERC-8004 IdentityRegistry registration event, used to map agentId
// to endpoint host on the leaderboard. Two plausible shapes, merged at read.
export const registeredEventA = {
  type: "event",
  name: "Registered",
  inputs: [
    { name: "agentId", type: "uint256", indexed: true },
    { name: "agentDomain", type: "string", indexed: false },
    { name: "agentAddress", type: "address", indexed: true },
  ],
} as const;

export const registeredEventB = {
  type: "event",
  name: "AgentRegistered",
  inputs: [
    { name: "agentId", type: "uint256", indexed: true },
    { name: "agentDomain", type: "string", indexed: false },
    { name: "agentAddress", type: "address", indexed: false },
  ],
} as const;
