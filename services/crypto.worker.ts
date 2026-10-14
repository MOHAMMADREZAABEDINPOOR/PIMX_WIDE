import { zipSync, unzipSync } from "fflate";
import { seal, open, portable, utf8, MAX_BYTES } from "./crypto";
import { safePath } from "./download";
self.onmessage = async (event) => {
  const { action, text, files, password } = event.data;
  const progress = (value: number, phase: string) =>
    self.postMessage({ progress: value, phase });
  try {
    if (action === "encrypt") {
      let bytes = utf8(text || ""),
        kind: "text" | "archive" = "text";
      if (files?.length) {
        kind = "archive";
        const entries: Record<string, Uint8Array> = Object.create(null);
        let total = 0;
        for (let i = 0; i < files.length; i++) {
          const f: File = files[i],
            name = f.webkitRelativePath || f.name;
          if (!safePath(name) || entries[name])
            throw new Error("Duplicate or invalid file path");
          total += f.size;
          if (total > MAX_BYTES) throw new Error("Files exceed 64 MB");
          entries[name] = new Uint8Array(await f.arrayBuffer());
          progress(Math.round(((i + 1) / files.length) * 35), "read");
        }
        bytes = zipSync(entries, { level: 0 });
      }
      progress(40, "key");
      const envelope = await seal(bytes, password, kind);
      progress(100, "done");
      self.postMessage({ result: { payload: portable(envelope), kind } });
    } else {
      progress(30, "key");
      const result = await open(text, password);
      if (result.kind === "archive") {
        let total = 0;
        const recovered = unzipSync(result.bytes, {
          filter: (f) => {
            total += f.originalSize;
            if (!safePath(f.name) || total > MAX_BYTES)
              throw new Error("Invalid archive");
            return true;
          },
        });
        const output = Object.entries(recovered).map(([name, bytes]) => ({
          name,
          bytes,
        }));
        progress(100, "done");
        self.postMessage({ result: { kind: "archive", files: output } });
      } else if (result.kind === "vault")
        throw new Error("Use vault backup import");
      else {
        progress(100, "done");
        self.postMessage({
          result: {
            kind: "text",
            text: new TextDecoder().decode(result.bytes),
          },
        });
      }
    }
  } catch {
    self.postMessage({ error: "operation_failed" });
  }
};
