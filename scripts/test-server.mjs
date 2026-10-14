import { mkdtemp, cp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { spawn } from "node:child_process";
import { pbkdf2Sync } from "node:crypto";
const root = resolve("."),
  sandbox = await mkdtemp(join(tmpdir(), "pimx-tests-"));
if (
  dirname(resolve(sandbox)) !== resolve(tmpdir()) ||
  !basename(sandbox).startsWith("pimx-tests-")
)
  throw new Error("Unexpected test sandbox path");
for (const name of ["dist", "functions", "migrations"])
  await cp(join(root, name), join(sandbox, name), { recursive: true });
await writeFile(
  join(sandbox, "dist", "sw-old.js"),
  "self.addEventListener('install',e=>e.waitUntil(caches.open('pimx-obsolete').then(c=>c.put('/index.html',new Response('OLD DESIGN'))).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));",
);
await writeFile(
  join(sandbox, "wrangler.toml"),
  `name="pimx-test"\ncompatibility_date="2024-12-01"\npages_build_output_dir="dist"\n[[d1_databases]]\nbinding="PIMX_DB"\ndatabase_name="pimx-test"\ndatabase_id="00000000-0000-0000-0000-000000000000"\nmigrations_dir="migrations"\n`,
);
const fixturePassword = "disposable-test-password",
  salt = "disposable-test-salt";
await writeFile(
  join(sandbox, ".dev.vars"),
  `ADMIN_PASSWORD_HASH=${salt}:${pbkdf2Sync(fixturePassword, salt, 600000, 32, "sha256").toString("hex")}\nSESSION_SECRET=disposable-session-secret-for-local-tests-only\n`,
);
const wrangler = join(root, "node_modules/wrangler/bin/wrangler.js");
const migrate = spawn(
  process.execPath,
  [
    wrangler,
    "d1",
    "migrations",
    "apply",
    "PIMX_DB",
    "--local",
    "--cwd",
    sandbox,
  ],
  { stdio: "inherit", windowsHide: true },
);
const status = await new Promise((r) => migrate.on("exit", r));
if (status !== 0) {
  await rm(sandbox, { recursive: true, force: true });
  process.exit(status || 1);
}
const server = spawn(
  process.execPath,
  [
    wrangler,
    "pages",
    "dev",
    "dist",
    "--port",
    "8788",
    "--ip",
    "127.0.0.1",
    "--cwd",
    sandbox,
  ],
  { stdio: "inherit", windowsHide: true },
);
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  server.kill();
  await new Promise((r) => setTimeout(r, 400));
  await rm(sandbox, {
    recursive: true,
    force: true,
    maxRetries: 4,
    retryDelay: 500,
  }).catch(() => {});
}
process.on("SIGINT", () => stop().then(() => process.exit()));
process.on("SIGTERM", () => stop().then(() => process.exit()));
server.on("exit", () => stop().then(() => process.exit()));
