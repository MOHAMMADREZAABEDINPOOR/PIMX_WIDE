import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
async function files(dir, base = "") {
  const list = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = base + "/" + entry.name;
    if (entry.isDirectory())
      list.push(...(await files(join(dir, entry.name), name)));
    else if (!entry.name.startsWith("_") && entry.name !== "sw.js")
      list.push(name);
  }
  return list;
}
const revision =
  process.env.CF_PAGES_COMMIT_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
await writeFile(
  "dist/build-info.json",
  JSON.stringify({
    revision,
    builtAt: new Date().toISOString(),
    languages: ["fa", "en", "ru", "zh", "de", "fr", "ja", "ko"],
  }),
);
const urls = await files("dist");
const hash = createHash("sha256");
for (const url of urls) hash.update(await readFile(join("dist", url)));
const version = hash.digest("hex").slice(0, 16);
await writeFile(
  "dist/sw.js",
  `const CACHE='pimx-${version}'; const URLS=${JSON.stringify(urls)};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pimx-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/'))return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{if(r.ok){const c=await caches.open(CACHE);await c.put('/index.html',r.clone());}return r;}).catch(async()=>{const c=await caches.open(CACHE);const r=await c.match('/index.html');return r||Response.error();}));return;}
if(URLS.includes(u.pathname))e.respondWith(caches.open(CACHE).then(async c=>{if(u.pathname.startsWith('/assets/'))return(await c.match(e.request))||fetch(e.request);try{const r=await fetch(e.request,{cache:'no-cache'});if(r.ok)await c.put(e.request,r.clone());return r;}catch{return(await c.match(e.request))||Response.error();}}));});`,
);
console.log(
  `Offline shell ${version}: ${urls.length} local assets. API responses are never cached.`,
);
