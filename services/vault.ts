import { Envelope } from "./crypto";
export interface VaultItem {
  id: string;
  title: string;
  tags: string[];
  favorite: boolean;
  created: number;
  payload: string;
  kind: "text" | "archive";
}
async function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open("pimx-private", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("vault");
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function access(
  mode: IDBTransactionMode,
  value?: Envelope | null,
): Promise<Envelope | null> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction("vault", mode),
      store = tx.objectStore("vault");
    const r =
      mode === "readonly"
        ? store.get("encrypted")
        : value === null
          ? store.delete("encrypted")
          : store.put(value, "encrypted");
    tx.oncomplete = () => {
      d.close();
      resolve(mode === "readonly" ? r.result || null : value || null);
    };
    tx.onerror = () => {
      d.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      d.close();
      reject(tx.error);
    };
  });
}
export const readVault = () => access("readonly");
export const writeVault = (e: Envelope) => access("readwrite", e);
export const deleteVault = () => access("readwrite", null);
export function validateItems(items: unknown): VaultItem[] {
  if (
    !Array.isArray(items) ||
    items.length > 500 ||
    items.some(
      (i) =>
        !i ||
        typeof i.id !== "string" ||
        typeof i.title !== "string" ||
        typeof i.payload !== "string" ||
        !["text", "archive"].includes(i.kind) ||
        !Array.isArray(i.tags) ||
        i.tags.some((t: any) => typeof t !== "string") ||
        typeof i.favorite !== "boolean" ||
        typeof i.created !== "number",
    )
  )
    throw new Error("Invalid backup");
  return items;
}
