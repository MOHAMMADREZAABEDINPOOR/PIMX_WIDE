import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { seal, open, utf8 } from "../services/crypto";
import {
  readVault,
  writeVault,
  validateItems,
  VaultItem,
} from "../services/vault";
const Context = createContext<{
  items: VaultItem[];
  unlocked: boolean;
  busy: boolean;
  unlock: (password: string) => Promise<void>;
  lock: () => void;
  save: (items: VaultItem[]) => Promise<void>;
}>(null!);
export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<VaultItem[]>([]),
    [unlocked, setUnlocked] = useState(false),
    [busy, setBusy] = useState(false);
  const secret = useRef(""),
    generation = useRef(0),
    mutating = useRef(false);
  const lock = () => {
    generation.current++;
    secret.current = "";
    setItems([]);
    setUnlocked(false);
  };
  useEffect(() => {
    window.addEventListener("pimx:lock", lock);
    return () => window.removeEventListener("pimx:lock", lock);
  }, []);
  async function unlock(password: string) {
    if (mutating.current) throw new Error("Busy");
    mutating.current = true;
    setBusy(true);
    const g = generation.current;
    try {
      const existing = await readVault();
      let next: VaultItem[] = [];
      if (existing) {
        const decoded = await open(JSON.stringify(existing), password);
        if (decoded.kind !== "vault") throw new Error("Invalid vault");
        next = validateItems(
          JSON.parse(new TextDecoder().decode(decoded.bytes)),
        );
      } else {
        if (password.length < 12) throw new Error("Use at least 12 characters");
        const e = await seal(utf8("[]"), password, "vault");
        if (g !== generation.current) return;
        await writeVault(e);
      }
      if (g !== generation.current) return;
      secret.current = password;
      setItems(next);
      setUnlocked(true);
    } finally {
      mutating.current = false;
      setBusy(false);
    }
  }
  async function save(next: VaultItem[]) {
    if (!secret.current || mutating.current)
      throw new Error("Vault locked or busy");
    mutating.current = true;
    setBusy(true);
    const g = generation.current;
    try {
      validateItems(next);
      const e = await seal(utf8(JSON.stringify(next)), secret.current, "vault");
      if (g !== generation.current) throw new Error("Vault locked");
      await writeVault(e);
      if (g === generation.current) setItems(next);
    } finally {
      mutating.current = false;
      setBusy(false);
    }
  }
  return (
    <Context.Provider value={{ items, unlocked, busy, unlock, lock, save }}>
      {children}
    </Context.Provider>
  );
}
export const useVault = () => useContext(Context);
