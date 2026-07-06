// End-to-end verification of the Packet Monsters local demo.
// Plays the game the way the web client does: faucet, 402 dance with
// EIP-3009 payment, pack mint, battle, ERC-8004 reputation read.
import { createPublicClient, createWalletClient, http, bytesToHex, parseAbi, formatUnits } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:3000";
const dep = JSON.parse(readFileSync("/Users/tjb/code/packet-monsters/web/src/lib/deployment.json", "utf8"));
const chain = { id: 31337, name: "anvil", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } } };
const pub = createPublicClient({ chain, transport: http() });

const pm = dep.contracts.PacketMonsters;
const usdc = dep.contracts.MockUSDC;
const repReg = dep.contracts.ReputationRegistry;

const pmAbi = dep.abis.PacketMonsters;
const die = (msg) => { console.error("FAIL:", msg); process.exit(1); };

async function buyPack(account) {
  // 1. 402 challenge
  const challenge = await fetch(`${BASE}/api/pack`);
  if (challenge.status !== 402) die(`expected 402, got ${challenge.status}`);
  const req = JSON.parse(Buffer.from(challenge.headers.get("payment-required"), "base64").toString());
  const offer = req.accepts[0];
  if (offer.asset.toLowerCase() !== usdc.toLowerCase()) die("402 asset mismatch");

  // 2. EIP-3009 signature (domain from deployment)
  const nonce = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
  const now = BigInt(Math.floor(Date.now() / 1000));
  const message = { from: account.address, to: offer.payTo, value: BigInt(offer.maxAmountRequired), validAfter: 0n, validBefore: now + 3600n, nonce };
  const sig = await account.signTypedData({
    domain: { name: dep.usdc.eip712Domain.name, version: dep.usdc.eip712Domain.version, chainId: 31337, verifyingContract: usdc },
    types: { TransferWithAuthorization: [
      { name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" }, { name: "validBefore", type: "uint256" }, { name: "nonce", type: "bytes32" },
    ]},
    primaryType: "TransferWithAuthorization",
    message,
  });
  const payload = {
    kind: "eip3009", from: account.address, to: offer.payTo,
    value: message.value.toString(), validAfter: "0", validBefore: message.validBefore.toString(),
    nonce, v: parseInt(sig.slice(130, 132), 16), r: `0x${sig.slice(2, 66)}`, s: `0x${sig.slice(66, 130)}`,
  };

  // 3. retry with PAYMENT header
  const paid = await fetch(`${BASE}/api/pack`, { headers: { PAYMENT: Buffer.from(JSON.stringify(payload)).toString("base64") } });
  const body = await paid.json();
  if (paid.status !== 200) die(`paid request failed ${paid.status}: ${JSON.stringify(body)}`);
  return body.tokenIds.map(BigInt);
}

const A = privateKeyToAccount(generatePrivateKey());
const B = privateKeyToAccount(generatePrivateKey());
console.log("burner A", A.address, "\nburner B", B.address);

// faucet both
for (const acct of [A, B]) {
  const r = await fetch(`${BASE}/api/faucet`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: acct.address }) });
  if (r.status !== 200) die(`faucet ${acct.address}: ${r.status} ${await r.text()}`);
}
const balA = await pub.readContract({ address: usdc, abi: dep.abis.MockUSDC, functionName: "balanceOf", args: [A.address] });
console.log("faucet OK, A USDC balance: $" + formatUnits(balA, 6));

// buy packs
const packA = await buyPack(A);
const packB = await buyPack(B);
console.log("pack A tokens:", packA.join(","), " pack B tokens:", packB.join(","));

// ownership + card data + onchain SVG
const ownerA0 = await pub.readContract({ address: pm, abi: pmAbi, functionName: "ownerOf", args: [packA[0]] });
if (ownerA0.toLowerCase() !== A.address.toLowerCase()) die("pack A token not owned by A");
const [def, card] = await pub.readContract({ address: pm, abi: pmAbi, functionName: "cardOf", args: [packA[0]] });
console.log(`card #${packA[0]}: "${def.name}" host=${def.host} hp=${def.hp} atk=${def.attack} spd=${def.speed} type=${def.typeId} rarity=${def.rarity} level=${card.level}`);
const uri = await pub.readContract({ address: pm, abi: pmAbi, functionName: "tokenURI", args: [packA[0]] });
const meta = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString());
const svg = Buffer.from(meta.image.split(",")[1], "base64").toString();
if (!svg.includes("<svg")) die("tokenURI image is not an SVG");
writeFileSync("/private/tmp/claude-501/-Users-tjb/7c245308-7cad-4670-8c97-8e91b2a82c68/scratchpad/card.svg", svg);
console.log("tokenURI OK: valid base64 JSON with SVG image, saved card.svg. USDC balance after pack: $" + formatUnits(await pub.readContract({ address: usdc, abi: dep.abis.MockUSDC, functionName: "balanceOf", args: [A.address] }), 6));

// battle: A's first card vs B's first card, called by A
const walletA = createWalletClient({ account: A, chain, transport: http() });
const battleHash = await walletA.writeContract({ address: pm, abi: pmAbi, functionName: "battle", args: [packA[0], packB[0]] });
const receipt = await pub.waitForTransactionReceipt({ hash: battleHash });
if (receipt.status !== "success") die("battle tx reverted");

const battleLogs = await pub.getLogs({ address: pm, event: parseAbi(["event BattleResult(uint256 indexed tokenA, uint256 indexed tokenB, uint256 winner, uint256 seed)"])[0], fromBlock: receipt.blockNumber, toBlock: receipt.blockNumber });
console.log("battle OK: winner token", battleLogs[0].args.winner.toString(), "seed", battleLogs[0].args.seed.toString().slice(0, 12) + "...");

// level-up check on winner
const winner = battleLogs[0].args.winner;
const [, winnerCard] = await pub.readContract({ address: pm, abi: pmAbi, functionName: "cardOf", args: [winner] });
console.log("winner level after battle:", winnerCard.level, "(expected 2)");

// ERC-8004 reputation feedback
const fb = await pub.getLogs({ address: repReg, event: parseAbi(["event NewFeedback(uint256 indexed agentId, address indexed client, int128 value, uint8 valueDecimals, string tag1, string tag2, string endpoint, string ipfsHash, bytes32 dataHash)"])[0], fromBlock: 0n, toBlock: "latest" });
const gameFb = fb.filter((l) => l.args.tag1 === "packet-monsters-battle");
if (gameFb.length === 0) die("no ERC-8004 feedback recorded for the battle");
console.log(`ERC-8004 feedback OK: agentId ${gameFb[0].args.agentId} endpoint "${gameFb[0].args.endpoint}" tag2 "${gameFb[0].args.tag2}" (${gameFb.length} total)`);

console.log("\nALL CHECKS PASSED");
