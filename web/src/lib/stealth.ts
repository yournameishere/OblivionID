/**
 * ERC-5564 Stealth Addresses (SECP256k1 with view tags, schemeId 1)
 * https://eips.ethereum.org/EIPS/eip-5564
 */

import * as secp from "@noble/secp256k1";
import { keccak256 } from "viem";
import { randomBytes } from "crypto";

secp.etc.hmacSha256Sync = (key: Uint8Array, ...msgs: Uint8Array[]) => {
  const { createHmac } = require("crypto");
  const h = createHmac("sha256", Buffer.from(key));
  msgs.forEach((m) => h.update(m));
  return new Uint8Array(h.digest());
};

function toHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function pubkeyToAddress(pubkey: Uint8Array): string {
  const uncompressed = pubkey.length === 33 ? secp.ProjectivePoint.fromHex(pubkey).toRawBytes(false) : pubkey;
  const hash = keccak256(`0x${toHex(uncompressed.slice(1))}`);
  return "0x" + hash.slice(-40);
}

/**
 * Generate a new stealth meta-address (recipient keys)
 */
export function generateStealthMetaAddress(): {
  spendingKey: string;
  viewingKey: string;
  stealthMetaAddress: string;
} {
  const spendingKey = secp.utils.randomPrivateKey();
  const viewingKey = secp.utils.randomPrivateKey();
  const spendingPubkey = secp.getPublicKey(spendingKey, true);
  const viewingPubkey = secp.getPublicKey(viewingKey, true);
  const stealthMetaAddress = `st:eth:0x${toHex(spendingPubkey)}${toHex(viewingPubkey)}`;
  return {
    spendingKey: "0x" + toHex(spendingKey),
    viewingKey: "0x" + toHex(viewingKey),
    stealthMetaAddress,
  };
}

/**
 * Generate a stealth address for a recipient (sender's perspective)
 * Given recipient's stealth meta-address, returns stealth address + ephemeral pubkey + view tag
 */
export function generateStealthAddress(stealthMetaAddress: string): {
  stealthAddress: string;
  ephemeralPubKey: string;
  viewTag: string;
} {
  const prefix = "st:eth:0x";
  if (!stealthMetaAddress.startsWith(prefix)) throw new Error("Invalid stealth meta-address format");
  const hex = stealthMetaAddress.slice(prefix.length);
  const spendingPubkey = Buffer.from(hex.slice(0, 66), "hex");
  const viewingPubkey = Buffer.from(hex.slice(66, 132), "hex");

  const pEphemeral = secp.utils.randomPrivateKey();
  const pEphemeralPub = secp.getPublicKey(pEphemeral, true);

  const sharedSecret = secp.getSharedSecret(pEphemeral, viewingPubkey, false);
  const sHHex = keccak256(`0x${toHex(sharedSecret)}`);
  const sHBigInt = BigInt(sHHex);

  const pStealthPoint = secp.ProjectivePoint.fromHex(spendingPubkey).add(
    secp.ProjectivePoint.BASE.multiply(sHBigInt)
  );
  const pStealthUncompressed = pStealthPoint.toRawBytes(false);
  const stealthAddress = pubkeyToAddress(pStealthUncompressed.slice(1));
  const viewTag = "0x" + sHHex.slice(2, 4);

  return {
    stealthAddress,
    ephemeralPubKey: "0x" + toHex(pEphemeralPub),
    viewTag,
  };
}
