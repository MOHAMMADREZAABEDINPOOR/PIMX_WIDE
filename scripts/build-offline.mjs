import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
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
const urls = await files("dist");
const hash = createHash("sha256");
for (const url of urls) hash.update(await readFile(join("dist", url)));
const version = hash.digest("hex").slice(0, 16);
await writeFile(
  "dist/sw.js",
  `const CACHE='pimx-${version}'; const URLS=${JSON.stringify(urls)};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pimx-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/'))return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(async()=>{const r=await caches.match('/index.html');return r?new Response(r.body,{status:r.status,headers:r.headers}):Response.error();}));return;}
if(URLS.includes(u.pathname))e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||fetch(e.request)));});`,
);
console.log(
  `Offline shell ${version}: ${urls.length} local assets. API responses are never cached.`,
);
