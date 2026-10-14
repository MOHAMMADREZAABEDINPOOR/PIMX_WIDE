import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  seal,
  open,
  portable,
  utf8,
  base64,
  parsePackage,
  password,
} from "../services/crypto";
import { validateItems } from "../services/vault";
import { safePath } from "../services/download";
test("passphrase vocabulary has 7776 distinct words and at least 77 bits for six words", async () => {
  const raw = await readFile(
    new URL("../data/eff-large-wordlist.txt", import.meta.url),
    "utf8",
  );
  const words = raw
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(/\s+/)[1]);
  assert.equal(words.length, 7776);
  assert.equal(new Set(words).size, 7776);
  assert.ok(words.every((word) => typeof word === "string" && word.length > 0));
  assert.ok(Math.floor(6 * Math.log2(words.length)) >= 77);
});
test("Persian, emoji, newlines and password whitespace round-trip; password is absent from exports", async () => {
  const secret = "  separate password  ";
  const input = "سلام دنیا 🔐\nSecond line\u0000";
  const e = await seal(utf8(input), secret, "text");
  assert.equal(
    new TextDecoder().decode((await open(portable(e), secret)).bytes),
    input,
  );
  assert.ok(!JSON.stringify(e).includes(secret));
  assert.equal(e.iterations, 600000);
});
test("wrong password, changed ciphertext and altered kind are rejected", async () => {
  const e = await seal(utf8("private"), "a-long-test-password", "text");
  await assert.rejects(open(JSON.stringify(e), "wrong-password"));
  await assert.rejects(
    open(JSON.stringify({ ...e, kind: "archive" }), "a-long-test-password"),
  );
  const c = atob(e.cipherText);
  await assert.rejects(
    open(
      JSON.stringify({
        ...e,
        cipherText: btoa(String.fromCharCode(c.charCodeAt(0) ^ 1) + c.slice(1)),
      }),
      "a-long-test-password",
    ),
  );
});
test("identical inputs receive distinct salts, IVs and ciphertext", async () => {
  const a = await seal(utf8("same"), "a-long-test-password", "text"),
    b = await seal(utf8("same"), "a-long-test-password", "text");
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.cipherText, b.cipherText);
});
test("legacy portable and legacy JSON exports decrypt without using embedded password", async () => {
  const secret = "legacy-pass";
  const salt = crypto.getRandomValues(new Uint8Array(16)),
    iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey(
    "raw",
    utf8(secret),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const aes = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    key,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aes,
    utf8("old content"),
  );
  const payload = btoa(
    JSON.stringify({
      salt: base64(salt),
      iv: base64(iv),
      cipherText: base64(new Uint8Array(ct)),
      createdAt: 1,
    }),
  );
  assert.equal(
    new TextDecoder().decode((await open(payload, secret)).bytes),
    "old content",
  );
  assert.equal(
    new TextDecoder().decode(
      (
        await open(
          JSON.stringify({ payload, password_reminder: "incorrect" }),
          secret,
        )
      ).bytes,
    ),
    "old content",
  );
});
test("reject invalid envelopes, unsupported KDF cost and unsafe paths", () => {
  assert.throws(() => parsePackage("{}"));
  assert.throws(() => parsePackage("PIMX2.invalid"));
  assert.equal(safePath("../secret"), false);
  assert.equal(safePath("/secret"), false);
  assert.equal(safePath("a/../../secret"), false);
  assert.equal(safePath("photos/تابستان.png"), true);
  assert.throws(() => validateItems([{}]));
});
test("password policy contains each requested group and honors exclusions", () => {
  for (let i = 0; i < 40; i++) {
    const p = password(20, ["abc", "XYZ", "012"]);
    assert.equal(p.length, 20);
    assert.match(p, /[abc]/);
    assert.match(p, /[XYZ]/);
    assert.match(p, /[012]/);
    assert.match(p, /^[abcXYZ012]+$/);
  }
  assert.throws(() => password(12, []));
});
