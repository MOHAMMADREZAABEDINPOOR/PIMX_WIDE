export type Kind = "text" | "archive" | "vault";
export interface Envelope {
  version: 2;
  algorithm: "AES-256-GCM";
  kdf: "PBKDF2-SHA256";
  iterations: number;
  salt: string;
  iv: string;
  cipherText: string;
  kind: Kind;
}
export const ITERATIONS = 600_000;
export const MAX_BYTES = 64 * 1024 * 1024;
const encoder = new TextEncoder();
export function base64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 8192)
    s += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(s);
}
export function unbase64(s: string): Uint8Array {
  if (typeof s !== "string" || s.length > MAX_BYTES * 1.4)
    throw new Error("Invalid or oversized package");
  const raw = atob(s);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
async function derive(password: string, salt: Uint8Array, iterations: number) {
  if (!password) throw new Error("Password required");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
function aad(
  e: Pick<Envelope, "version" | "algorithm" | "kdf" | "iterations" | "kind">,
) {
  return encoder.encode(
    JSON.stringify([e.version, e.algorithm, e.kdf, e.iterations, e.kind]),
  );
}
export async function seal(
  bytes: Uint8Array,
  password: string,
  kind: Kind,
): Promise<Envelope> {
  if (bytes.byteLength > MAX_BYTES) throw new Error("Package exceeds 64 MB");
  const salt = crypto.getRandomValues(new Uint8Array(16)),
    iv = crypto.getRandomValues(new Uint8Array(12));
  const e = {
    version: 2 as const,
    algorithm: "AES-256-GCM" as const,
    kdf: "PBKDF2-SHA256" as const,
    iterations: ITERATIONS,
    salt: base64(salt),
    iv: base64(iv),
    kind,
  };
  const key = await derive(password, salt, ITERATIONS);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: aad(e) },
    key,
    bytes as BufferSource,
  );
  return { ...e, cipherText: base64(new Uint8Array(encrypted)) };
}
export function parsePackage(
  input: string,
  depth = 0,
):
  Envelope | { iv: string; salt: string; cipherText: string; version?: never } {
  if (depth > 2) throw new Error("Invalid nested package");
  if (input.length > MAX_BYTES * 1.4 + 4096)
    throw new Error("Package too large");
  let e: any;
  try {
    e = JSON.parse(input);
  } catch {
    e = JSON.parse(atob(input.trim().replace(/^PIMX2\./, "")));
  }
  if (e?.payload) return parsePackage(e.payload, depth + 1);
  if (
    !e ||
    typeof e.iv !== "string" ||
    typeof e.salt !== "string" ||
    typeof e.cipherText !== "string"
  )
    throw new Error("Invalid package");
  if (
    unbase64(e.iv).length !== 12 ||
    unbase64(e.salt).length !== 16 ||
    unbase64(e.cipherText).length < 16
  )
    throw new Error("Invalid package");
  if (
    e.version !== undefined &&
    (e.version !== 2 ||
      e.algorithm !== "AES-256-GCM" ||
      e.kdf !== "PBKDF2-SHA256" ||
      !["text", "archive", "vault"].includes(e.kind) ||
      e.iterations !== ITERATIONS)
  )
    throw new Error("Unsupported package version");
  return e;
}
export async function open(
  input: string,
  password: string,
): Promise<{ bytes: Uint8Array; kind: Kind }> {
  const e = parsePackage(input);
  const key = await derive(
    password,
    unbase64(e.salt),
    e.version === 2 ? e.iterations : 100_000,
  );
  const bytes = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: unbase64(e.iv) as BufferSource,
      ...(e.version === 2 ? { additionalData: aad(e) } : {}),
    },
    key,
    unbase64(e.cipherText) as BufferSource,
  );
  return {
    bytes: new Uint8Array(bytes),
    kind: e.version === 2 ? e.kind : "text",
  };
}
export const portable = (e: Envelope) => "PIMX2." + btoa(JSON.stringify(e));
export const utf8 = (s: string) => encoder.encode(s);
export function randomInt(max: number) {
  if (!Number.isInteger(max) || max < 1 || max > 65536)
    throw new Error("Invalid alphabet");
  const a = new Uint32Array(1),
    ceiling = Math.floor(4294967296 / max) * max;
  do {
    crypto.getRandomValues(a);
  } while (a[0] >= ceiling);
  return a[0] % max;
}
export function password(
  length = 24,
  groups = [
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "0123456789",
    "!@#$%&*-_+=?",
  ],
) {
  if (!groups.length || length < groups.length || length > 128)
    throw new Error("Select at least one character group");
  const pool = groups.join(""),
    chars = groups.map((g) => g[randomInt(g.length)]);
  while (chars.length < length) chars.push(pool[randomInt(pool.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}
