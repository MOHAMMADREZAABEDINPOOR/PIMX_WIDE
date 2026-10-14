import React, { useEffect, useState } from "react";
import {
  LockKeyhole,
  UnlockKeyhole,
  Search,
  Star,
  Download,
  UploadCloud,
  Trash2,
  FileText,
  Files,
  ArrowUpRight,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { useVault } from "../contexts/VaultContext";
import {
  readVault,
  writeVault,
  validateItems,
  VaultItem,
} from "../services/vault";
import { parsePackage, open } from "../services/crypto";
import { download } from "../services/download";
import { Modal, PageHeading } from "../components/ui";
import { SystemVisual } from "../components/SystemVisual";
import {
  AnimatePresence,
  motion,
  ease,
  useMotionEnabled,
} from "../components/motion";
export function VaultPage({
  toast,
  usePayload,
}: {
  toast: (s: string) => void;
  usePayload: (s: string) => void;
}) {
  const { l, prefs } = usePreferences(),
    vault = useVault();
  const animated = useMotionEnabled();
  const [exists, setExists] = useState<boolean | null>(null),
    [pass, setPass] = useState(""),
    [confirm, setConfirm] = useState(""),
    [query, setQuery] = useState(""),
    [favorites, setFavorites] = useState(false),
    [error, setError] = useState(""),
    [edit, setEdit] = useState<VaultItem | null>(null),
    [remove, setRemove] = useState<VaultItem | null>(null),
    [importing, setImporting] = useState(""),
    [importPass, setImportPass] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    readVault()
      .then((e) => {
        if (active) setExists(!!e);
      })
      .catch(() => {
        if (active)
          setError(
            l(
              "ذخیره‌سازی مرورگر در دسترس نیست.",
              "Browser storage is unavailable.",
            ),
          );
      });
    return () => {
      active = false;
    };
  }, []);
  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!exists && pass !== confirm) {
      setError(l("رمزها یکسان نیستند.", "Passwords do not match."));
      return;
    }
    try {
      await vault.unlock(pass);
      setPass("");
      setConfirm("");
      setExists(true);
    } catch {
      setError(
        l(
          "بازکردن گاوصندوق انجام نشد. رمز عبور و دسترسی ذخیره‌سازی را بررسی کنید.",
          "Could not unlock. Check your password and storage access.",
        ),
      );
    }
  }
  async function update(items: VaultItem[]) {
    try {
      await vault.save(items);
      return true;
    } catch {
      toast(
        l(
          "تغییر ذخیره نشد؛ گاوصندوق یا فضای دستگاه را بررسی کنید.",
          "Could not save changes. Check your vault and device storage.",
        ),
      );
      return false;
    }
  }
  async function backup() {
    try {
      const e = await readVault();
      if (e)
        download(
          JSON.stringify(e),
          "pimx-vault-backup.json",
          "application/json",
        );
    } catch {
      toast(l("دریافت پشتیبان ناموفق بود.", "Backup failed."));
    }
  }
  async function importBackup() {
    setBusy(true);
    setError("");
    try {
      const env = parsePackage(importing);
      if (env.version !== 2 || env.kind !== "vault")
        throw new Error("Wrong backup");
      const decoded = await open(importing, importPass);
      const items = validateItems(
        JSON.parse(new TextDecoder().decode(decoded.bytes)),
      );
      if (vault.unlocked) {
        const ids = new Set(vault.items.map((i) => i.id));
        await vault.save([
          ...vault.items,
          ...items.filter((i) => !ids.has(i.id)),
        ]);
      } else {
        if (exists) throw new Error("Unlock existing vault first");
        await writeVault(env);
        setExists(true);
      }
      setImporting("");
      setImportPass("");
      toast(
        l(
          "پشتیبان وارد شد؛ رمز اصلی پشتیبان را نگه دارید.",
          "Backup imported. Keep its original password.",
        ),
      );
    } catch {
      setError(
        l(
          "ورود پشتیبان انجام نشد. رمز، فایل و قفل گاوصندوق را بررسی کنید.",
          "Import failed. Check the backup password, file and vault lock.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  const visible = vault.items
    .filter(
      (i) =>
        (!favorites || i.favorite) &&
        `${i.title} ${i.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.created - a.created);
  return (
    <div className="workspace wrap">
      <PageHeading
        eyebrow={l("ذخیره‌سازی در مرورگر", "Browser storage")}
        title={l("گاوصندوق من", "My personal vault")}
        text={l(
          "بسته‌ها، عنوان‌ها و برچسب‌ها با رمز گاوصندوق در همین مرورگر ذخیره می‌شوند.",
          "Packages, titles and tags are encrypted with your vault password and stored in this browser.",
        )}
      >
        <span className="status-pill">
          {vault.unlocked ? (
            <UnlockKeyhole size={14} />
          ) : (
            <LockKeyhole size={14} />
          )}{" "}
          {vault.unlocked ? l("باز است", "UNLOCKED") : l("قفل است", "LOCKED")}
        </span>
      </PageHeading>
      {!vault.unlocked ? (
        <div className="vault-unlock">
          <div className="unlock-art">
            <SystemVisual kind="archive" />
            <div className="eyebrow">
              {" "}
              {l(
                "حریم خصوصی در طراحی / پردازش محلی با انتخاب شما",
                "PRIVATE BY DESIGN / LOCAL BY CHOICE",
              )}{" "}
            </div>
          </div>
          <form className="panel unlock-form" onSubmit={unlock}>
            <span className="tool-icon">
              <LockKeyhole size={25} />
            </span>
            <h2>
              {exists === false
                ? l("گاوصندوقت رو بساز.", "Create your private vault.")
                : l("خوش برگشتی.", "Welcome back.")}
            </h2>
            <p className="muted">
              {exists === false
                ? l(
                    "یک رمز مستقل با حداقل ۱۲ کاراکتر انتخاب کنید. بازیابی رمز وجود ندارد.",
                    "Choose a separate password with at least 12 characters. There is no password recovery.",
                  )
                : l(
                    "رمز اصلی گاوصندوق را وارد کنید. این رمز برای بازکردن بسته‌های داخل آن استفاده نمی‌شود.",
                    "Enter your vault password. Packages inside still use their own passwords.",
                  )}
            </p>
            <label className="field-label">
              {l("رمز اصلی گاوصندوق", "Vault password")}
              <input
                type="password"
                dir="ltr"
                required
                minLength={exists ? 1 : 12}
                autoComplete={exists ? "current-password" : "new-password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </label>
            {exists === false && (
              <label className="field-label">
                {l("تکرار رمز", "Confirm password")}
                <input
                  type="password"
                  dir="ltr"
                  minLength={12}
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
            )}
            {error && (
              <p className="error-note" role="alert">
                {error}
              </p>
            )}
            <button
              className="btn primary full"
              disabled={vault.busy || exists === null}
            >
              {vault.busy
                ? l("در حال پردازش…", "Processing…")
                : exists === false
                  ? l("ساخت گاوصندوق", "Create vault")
                  : l("بازکردن گاوصندوق", "Unlock vault")}
              <ArrowUpRight size={17} />
            </button>
            <div className="subtle-note">
              <ShieldCheck size={16} />
              {l(
                "پشتیبان بگیرید؛ پاک‌کردن داده‌های مرورگر می‌تواند گاوصندوق را حذف کند.",
                "Back up your vault. Clearing browser data can remove it.",
              )}
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="vault-toolbar">
            <div className="search-field">
              <Search size={18} />
              <input
                placeholder={l(
                  "جست‌وجوی عنوان و برچسب…",
                  "Search titles and tags…",
                )}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className={`btn secondary ${favorites ? "accent-text" : ""}`}
              onClick={() => setFavorites(!favorites)}
            >
              <Star size={16} />
              {l("علاقه‌مندی‌ها", "Favorites")}
            </button>
            <button
              className="btn secondary"
              disabled={vault.busy}
              onClick={backup}
            >
              <Download size={16} />
              {l("پشتیبان", "Backup")}
            </button>
            <button
              className="btn secondary"
              onClick={() => {
                vault.lock();
                setEdit(null);
                setRemove(null);
                setQuery("");
              }}
            >
              <LockKeyhole size={16} />
              {l("قفل", "Lock")}
            </button>
          </div>
          <div className="vault-summary">
            <span>
              {vault.items.length} {l("بسته رمز‌شده", "encrypted packages")}
            </span>
            <span>
              {l("ذخیره‌سازی محلی · IndexedDB", "Local storage · IndexedDB")}
            </span>
          </div>
          {!visible.length ? (
            <div className="panel blank-state">
              <LockKeyhole size={40} />
              <h2>
                {vault.items.length
                  ? l("نتیجه‌ای پیدا نشد.", "No matching packages.")
                  : l("جای چیزهای مهمت اینجاست.", "A place for what matters.")}
              </h2>
              <p>
                {l(
                  "در استودیو یک بسته بسازید و «ذخیره در گاوصندوق» را انتخاب کنید.",
                  "Create a package in the studio and choose Save to vault.",
                )}
              </p>
              <button
                className="btn primary"
                onClick={() => {
                  history.pushState(null, "", "/studio");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                <Plus size={17} />
                {l("ساخت بسته جدید", "Create a package")}
              </button>
            </div>
          ) : (
            <div className="vault-cards">
              <AnimatePresence initial={false}>
                {visible.map((i) => (
                  <motion.article
                    layout="position"
                    initial={animated ? { opacity: 0, y: 12 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: animated ? 0.97 : 1 }}
                    transition={{ duration: animated ? 0.3 : 0, ease }}
                    className="panel vault-item"
                    key={i.id}
                  >
                    <div className="vault-item-top">
                      <span className="tool-icon">
                        {i.kind === "text" ? (
                          <FileText size={23} />
                        ) : (
                          <Files size={23} />
                        )}
                      </span>
                      <button
                        className="icon-btn"
                        disabled={vault.busy}
                        aria-label={l("تغییر علاقه‌مندی", "Toggle favorite")}
                        onClick={() =>
                          update(
                            vault.items.map((x) =>
                              x.id === i.id
                                ? { ...x, favorite: !x.favorite }
                                : x,
                            ),
                          )
                        }
                      >
                        <Star
                          size={18}
                          className={i.favorite ? "starred" : ""}
                        />
                      </button>
                    </div>
                    <h3>{i.title}</h3>
                    <small className="muted">
                      {new Date(i.created).toLocaleDateString(
                        prefs.lang === "zh" ? "zh-CN" : prefs.lang,
                      )}
                    </small>
                    <div className="tags">
                      {i.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="vault-item-actions">
                      <button
                        className="text-link"
                        onClick={() => usePayload(i.payload)}
                      >
                        {l("بازکردن در استودیو", "Open in studio")}
                        <ArrowUpRight size={15} />
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={l("دانلود بسته", "Download package")}
                        onClick={() =>
                          download(
                            i.payload,
                            `${i.title.replace(/[^\p{L}\p{N} _-]/gu, "_")}.pimx`,
                          )
                        }
                      >
                        <Download size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={l(
                          "ویرایش عنوان و برچسب",
                          "Edit title and tags",
                        )}
                        onClick={() => setEdit(i)}
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        className="icon-btn danger"
                        aria-label={l("حذف بسته", "Delete package")}
                        onClick={() => setRemove(i)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
      <div className="backup-import">
        <UploadCloud size={18} />
        <span>{l("پشتیبان داری؟", "Have a backup?")}</span>
        <label className="text-link file-label">
          {l("واردکردن فایل پشتیبان", "Import a backup")}
          <input
            type="file"
            accept=".json"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              if (exists && !vault.unlocked) {
                toast(
                  l(
                    "برای ادغام پشتیبان، اول گاوصندوق فعلی را باز کنید.",
                    "Unlock the current vault before merging a backup.",
                  ),
                );
                return;
              }
              if (f.size > 90 * 1048576) {
                toast(l("فایل بیش از حد بزرگ است.", "File too large."));
                return;
              }
              try {
                setImporting(await f.text());
                setError("");
              } catch {
                toast(l("فایل خوانده نشد.", "Could not read file."));
              }
            }}
          />
        </label>
      </div>
      {edit && vault.unlocked && (
        <Modal
          title={l("ویرایش بسته", "Edit package")}
          close={() => setEdit(null)}
        >
          <label className="field-label">
            {l("عنوان", "Title")}
            <input
              value={edit.title}
              maxLength={120}
              onChange={(e) => setEdit({ ...edit, title: e.target.value })}
            />
          </label>
          <label className="field-label">
            {l("برچسب‌ها با کاما", "Comma-separated tags")}
            <input
              value={edit.tags.join(",")}
              maxLength={250}
              onChange={(e) =>
                setEdit({ ...edit, tags: e.target.value.split(",") })
              }
            />
          </label>
          <button
            className="btn primary full"
            disabled={vault.busy}
            onClick={async () => {
              if (
                await update(
                  vault.items.map((i) =>
                    i.id === edit.id
                      ? {
                          ...edit,
                          tags: edit.tags.map((t) => t.trim()).filter(Boolean),
                        }
                      : i,
                  ),
                )
              )
                setEdit(null);
            }}
          >
            {l("ذخیره تغییرات", "Save changes")}
          </button>
        </Modal>
      )}
      {remove && vault.unlocked && (
        <Modal
          title={l("حذف این بسته؟", "Delete this package?")}
          close={() => setRemove(null)}
        >
          <p>{remove.title}</p>
          <p className="muted">
            {l(
              "این کار نسخه محلی این بسته را از گاوصندوق حذف می‌کند.",
              "This removes the local vault copy of this package.",
            )}
          </p>
          <button
            className="btn danger-btn full"
            disabled={vault.busy}
            onClick={async () => {
              if (await update(vault.items.filter((i) => i.id !== remove.id)))
                setRemove(null);
            }}
          >
            {l("حذف بسته", "Delete package")}
          </button>
        </Modal>
      )}
      {importing && (
        <Modal
          title={l("واردکردن پشتیبان رمز‌شده", "Import encrypted backup")}
          canClose={!busy}
          close={() => {
            if (!busy) {
              setImporting("");
              setImportPass("");
            }
          }}
        >
          <p className="muted">
            {vault.unlocked
              ? l(
                  "بسته‌های جدید با گاوصندوق فعلی ادغام می‌شوند.",
                  "New packages will be merged into your current vault.",
                )
              : l(
                  "پشتیبان با رمز اصلی خودش روی این دستگاه ذخیره می‌شود.",
                  "The backup will be stored with its original password on this device.",
                )}
          </p>
          <label className="field-label">
            {l("رمز پشتیبان", "Backup password")}
            <input
              type="password"
              value={importPass}
              dir="ltr"
              onChange={(e) => setImportPass(e.target.value)}
            />
          </label>
          {error && (
            <p className="error-note" role="alert">
              {error}
            </p>
          )}
          <button
            className="btn primary full"
            disabled={busy || !importPass}
            onClick={importBackup}
          >
            {busy
              ? l("در حال ورود…", "Importing…")
              : l("بررسی و واردکردن", "Verify & import")}
          </button>
        </Modal>
      )}
    </div>
  );
}
