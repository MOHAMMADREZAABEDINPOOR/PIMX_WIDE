import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline";
// Read via stdin: never put passwords into process arguments or source files.
console.error(
  "Read admin password from stdin (minimum 12 characters). Do not commit the output.",
);
const rl = createInterface({ input: process.stdin });
const lines = [];
for await (const line of rl) {
  lines.push(line);
  break;
}
const password = lines[0] || "";
if (password.length < 12) {
  console.error("Password too short");
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
console.log(
  "ADMIN_PASSWORD_HASH=" +
    salt +
    ":" +
    pbkdf2Sync(password, salt, 600000, 32, "sha256").toString("hex"),
);
console.log("SESSION_SECRET=" + randomBytes(32).toString("hex"));
