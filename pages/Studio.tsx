import React, { useEffect, useRef, useState } from "react";
import {
  LockKeyhole,
  UnlockKeyhole,
  FileText,
  Files,
  UploadCloud,
  Download,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  ArrowUpRight,
  FolderOpen,
  QrCode,
  Link2,
  BookmarkPlus,
  File,
  KeyRound,
} from "lucide-react";
import QRCode from "qrcode";
import { Select } from "../components/Select";
import {
  AnimatePresence,
  motion,
  Swap,
  ease,
  useMotionEnabled,
} from "../components/motion";
import { Scene3D } from "../components/Scene3D";
import { Tabs } from "../components/Tabs";
import { zipSync } from "fflate";
import { usePreferences } from "../contexts/Preferences";
import { useVault } from "../contexts/VaultContext";
import { password as makePassword } from "../services/crypto";
import { download, formatBytes } from "../services/download";
import { Modal, PageHeading, clipboard } from "../components/ui";
import { SystemVisual } from "../components/SystemVisual";
type Result = {
  kind: "text" | "archive";
  payload?: string;
  text?: string;
  files?: { name: string; bytes: Uint8Array }[];
};
export function Studio({
  initialPayload,
  clearPayload,
  toast,
}: {
  initialPayload: string;
  clearPayload: () => void;
  toast: (s: string) => void;
}) {
  const { l } = usePreferences(),
    vault = useVault();
  const animated = useMotionEnabled();
  const [action, setAction] = useState<"encrypt" | "decrypt">(
      initialPayload || location.pathname === "/decrypt"
        ? "decrypt"
        : "encrypt",
    ),
    [mode, setMode] = useState<"text" | "files">("text"),
    [text, setText] = useState(initialPayload),
    [pass, setPass] = useState(""),
    [show, setShow] = useState(false),
    [files, setFiles] = useState<File[]>([]),
    [result, setResult] = useState<Result | null>(null),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState(0),
    [phase, setPhase] = useState(""),
    [error, setError] = useState(""),
    [share, setShare] = useState(false),
    [save, setSave] = useState(false),
    [title, setTitle] = useState(""),
    [tags, setTags] = useState(""),
    [drag, setDrag] = useState(false);
  const worker = useRef<Worker | null>(null),
    inputRef = useRef<HTMLInputElement>(null),
    folderRef = useRef<HTMLInputElement>(null),
    operation = useRef(0),
    importVersion = useRef(0);
  const limit = /Mobi|Android/i.test(navigator.userAgent)
    ? 24 * 1048576
    : 48 * 1048576;
  useEffect(() => {
    if (initialPayload) {
      setAction("decrypt");
      setText(initialPayload);
      setMode("text");
      setResult(null);
      clearPayload();
    }
  }, [initialPayload]);
  useEffect(
    () => () => {
      worker.current?.terminate();
      operation.current++;
      importVersion.current++;
    },
    [],
  );
  function cancel() {
    operation.current++;
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setProgress(0);
  }
  function reset() {
    cancel();
    importVersion.current++;
    setResult(null);
    setError("");
    setPass("");
    setText("");
    setFiles([]);
  }
  function switchAction(a: "encrypt" | "decrypt") {
    reset();
    setAction(a);
    setMode("text");
  }
  async function addFiles(selected: FileList | File[]) {
    setError("");
    setResult(null);
    if (action === "decrypt") {
      const f = Array.from(selected)[0];
      if (!f) return;
      const v = ++importVersion.current;
      if (f.size > limit * 1.9) {
        setError(
          l(
            "بسته برای این دستگاه بیش از حد بزرگ است.",
            "Package exceeds the device limit.",
          ),
        );
        return;
      }
      try {
        const content = await f.text();
        if (v === importVersion.current) {
          setText(content);
          setMode("text");
        }
      } catch {
        setError(l("خواندن فایل ناموفق بود.", "Could not read file."));
      }
      return;
    }
    const next = [...files, ...Array.from(selected)];
    if (next.length > 100 || next.reduce((a, f) => a + f.size, 0) > limit) {
      setError(
        l(
          "حداکثر ۱۰۰ فایل و {limit} در هر بسته.",
          "Up to 100 files and {limit} per package.",
          { limit: formatBytes(limit) },
        ),
      );
      return;
    }
    const names = next.map((f) => f.webkitRelativePath || f.name);
    if (new Set(names).size !== names.length) {
      setError(
        l("فایل‌هایی با مسیر یکسان انتخاب شده‌اند.", "Duplicate file paths."),
      );
      return;
    }
    setMode("files");
    setFiles(next);
  }
  function run() {
    setError("");
    setResult(null);
    if (!crypto.subtle) {
      setError(
        l(
          "مرورگر به HTTPS و Web Crypto نیاز دارد.",
          "HTTPS and Web Crypto are required.",
        ),
      );
      return;
    }
    if (action === "encrypt" && pass.length < 12) {
      setError(
        l(
          "رمز عبور باید حداقل ۱۲ کاراکتر باشد.",
          "Use at least 12 characters for encryption.",
        ),
      );
      return;
    }
    if (
      new TextEncoder().encode(text).length >
      (action === "encrypt" ? limit : limit * 1.9)
    ) {
      setError(
        l("ورودی بیش از حد بزرگ است.", "Input exceeds the device limit."),
      );
      return;
    }
    cancel();
    setBusy(true);
    const id = ++operation.current;
    try {
      const w = new Worker(
        new URL("../services/crypto.worker.ts", import.meta.url),
        { type: "module" },
      );
      worker.current = w;
      w.onmessage = (e) => {
        if (id !== operation.current) return;
        if (e.data.progress !== undefined) {
          setProgress(e.data.progress);
          setPhase(e.data.phase);
        }
        if (e.data.result) {
          setResult(e.data.result);
          setBusy(false);
          w.terminate();
          worker.current = null;
        }
        if (e.data.error) {
          setError(
            l(
              "عملیات انجام نشد؛ رمز عبور، ساختار بسته و محدودیت حجم را بررسی کنید.",
              "Operation failed. Check the password, package format and size limit.",
            ),
          );
          setBusy(false);
          w.terminate();
          worker.current = null;
        }
      };
      w.onerror = () => {
        setBusy(false);
        setError(
          l(
            "پردازش متوقف شد. دوباره تلاش کنید.",
            "Processing stopped. Please try again.",
          ),
        );
        w.terminate();
      };
      w.postMessage({
        action,
        text,
        files: action === "encrypt" && mode === "files" ? files : [],
        password: pass,
      });
    } catch {
      setBusy(false);
      setError(
        l(
          "مرورگر نتوانست پردازشگر را راه‌اندازی کند.",
          "Could not start the worker.",
        ),
      );
    }
  }
  async function copy(s: string) {
    try {
      await clipboard(s);
      toast(l("کپی شد.", "Copied."));
    } catch {
      toast(
        l(
          "کپی انجام نشد؛ متن را دستی انتخاب کنید.",
          "Copy failed. Select the text manually.",
        ),
      );
    }
  }
  async function saveItem() {
    if (!result?.payload) return;
    try {
      await vault.save([
        ...vault.items,
        {
          id: crypto.randomUUID(),
          title: title.trim() || l("بسته بدون عنوان", "Untitled package"),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 10),
          favorite: false,
          created: Date.now(),
          payload: result.payload,
          kind: result.kind,
        },
      ]);
      setSave(false);
      toast(l("در گاوصندوق ذخیره شد.", "Saved to vault."));
    } catch {
      toast(
        l(
          "ذخیره نشد؛ قفل و فضای دستگاه را بررسی کنید.",
          "Could not save. Check the vault lock and device storage.",
        ),
      );
    }
  }
  const valid =
    pass &&
    (action === "decrypt" || mode === "text" ? text.length : files.length);
  return (
    <div className="workspace wrap">
      <PageHeading
        eyebrow={l("متن، فایل و پوشه", "Text, files and folders")}
        title={l("استودیوی رمزنگاری", "Cipher studio")}
        text={l(
          "متن یا فایل را با رمز عبور محافظت کنید، یا بسته‌ای را که دریافت کرده‌اید باز کنید.",
          "Protect text or files with a password, or open a package you received.",
        )}
      >
        <span className="status-pill">
          <i className="live-dot" />
          {l("پردازش محلی", "Local processing")}
        </span>
      </PageHeading>
      <div className="studio-controls">
        <Tabs
          value={action}
          onChange={(value) => switchAction(value as "encrypt" | "decrypt")}
          items={[
            {
              value: "encrypt",
              label: l("رمزکردن", "Encrypt"),
              icon: <LockKeyhole size={17} />,
            },
            {
              value: "decrypt",
              label: l("رمزگشایی", "Decrypt"),
              icon: <UnlockKeyhole size={17} />,
            },
          ]}
        />
        <span className="micro-label">AES–256 GCM / PBKDF2–SHA256</span>
      </div>
      <div className="studio-grid">
        <section className="panel input-panel">
          <div className="panel-heading">
            <span className="step-number">01</span>
            <h2>{l("ورودی شما", "Your input")}</h2>
            <button
              className="icon-btn"
              onClick={reset}
              aria-label={l("پاک‌کردن ورودی‌ها", "Clear inputs")}
            >
              <RefreshCw size={16} />
            </button>
          </div>
          {action === "encrypt" && (
            <Tabs
              underline
              value={mode}
              onChange={(value) => {
                setMode(value as "text" | "files");
                setResult(null);
              }}
              items={[
                {
                  value: "text",
                  label: l("متن", "Text"),
                  icon: <FileText size={16} />,
                },
                {
                  value: "files",
                  label: l("فایل و پوشه", "Files & folders"),
                  icon: <Files size={16} />,
                },
              ]}
            />
          )}
          <Swap id={`${action}-${mode}`} className="input-transition">
            {mode === "text" ? (
              <label className="field-label">
                {action === "encrypt"
                  ? l(
                      "چی رو می‌خوای خصوصی نگه داری؟",
                      "What would you like to keep private?",
                    )
                  : l(
                      "بسته رمز‌شده را وارد کنید",
                      "Paste your encrypted package",
                    )}
                <textarea
                  className="studio-textarea"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setResult(null);
                  }}
                  disabled={busy}
                  placeholder={
                    action === "encrypt"
                      ? l("از اینجا شروع کن…", "Start here…")
                      : "PIMX2.…"
                  }
                  dir={action === "decrypt" ? "ltr" : "auto"}
                />
                <span className="field-meta">
                  {text.length.toLocaleString()} {l("کاراکتر", "characters")}
                  <span>
                    {action === "decrypt" ? "PIMX v2 + legacy" : "UTF–8"}
                  </span>
                </span>
              </label>
            ) : (
              <>
                <div
                  className={`drop-zone ${drag ? "dragging" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    if (!busy) addFiles(e.dataTransfer.files);
                  }}
                >
                  <UploadCloud size={35} />
                  <h3>{l("فایل‌ها رو اینجا بنداز", "Drop your files here")}</h3>
                  <p>
                    {l("هر فرمت؛ تا ", "Any format; up to ")}
                    {formatBytes(limit)}
                  </p>
                  <div>
                    <button
                      className="btn secondary"
                      disabled={busy}
                      onClick={() => inputRef.current?.click()}
                    >
                      <File size={15} />
                      {l("انتخاب فایل", "Choose files")}
                    </button>
                    <button
                      className="btn ghost"
                      disabled={busy}
                      onClick={() => folderRef.current?.click()}
                    >
                      <FolderOpen size={16} />
                      {l("انتخاب پوشه", "Choose folder")}
                    </button>
                  </div>
                </div>
                <div className="file-queue">
                  <AnimatePresence initial={false}>
                    {files.map((f, i) => (
                      <motion.div
                        layout="position"
                        key={f.webkitRelativePath || f.name}
                        initial={animated ? { opacity: 0, y: 10 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: animated ? 16 : 0 }}
                        transition={{ duration: animated ? 0.24 : 0, ease }}
                      >
                        <File size={17} />
                        <span>
                          {f.webkitRelativePath || f.name}
                          <small>{formatBytes(f.size)}</small>
                        </span>
                        <button
                          className="icon-btn"
                          disabled={busy}
                          aria-label={l("حذف فایل", "Remove file")}
                          onClick={() =>
                            setFiles(files.filter((_, j) => i !== j))
                          }
                        >
                          <X size={15} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </Swap>
          <input
            ref={inputRef}
            type="file"
            multiple={action === "encrypt"}
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <input
            ref={folderRef}
            type="file"
            multiple
            {...({ webkitdirectory: "" } as any)}
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {action === "decrypt" && (
            <button
              className="btn secondary full"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud size={16} />
              {l("یا فایل بسته را انتخاب کنید", "Or import a package file")}
            </button>
          )}
          <div className="password-field">
            <div className="label-row">
              <label htmlFor="studio-password">
                {l("رمز عبور بسته", "Package password")}
              </label>
              {action === "encrypt" && (
                <button
                  className="text-link"
                  disabled={busy}
                  onClick={() => {
                    setPass(makePassword());
                    setShow(true);
                    setResult(null);
                  }}
                >
                  <KeyRound size={13} />
                  {l("ساخت رمز قوی", "Generate")}
                </button>
              )}
            </div>
            <div className="input-with-icon">
              <input
                id="studio-password"
                value={pass}
                disabled={busy}
                onChange={(e) => {
                  setPass(e.target.value);
                  setResult(null);
                }}
                type={show ? "text" : "password"}
                autoComplete="off"
                dir="ltr"
                placeholder={l(
                  "رمزی که فقط خودت می‌دونی",
                  "A password only you know",
                )}
              />
              <button
                className="icon-btn"
                onClick={() => setShow(!show)}
                aria-label={l(
                  "نمایش یا مخفی‌کردن رمز",
                  "Toggle password visibility",
                )}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <small className="muted">
              {l(
                "رمز عبور را جدا نگه دارید؛ امکان بازیابی آن وجود ندارد.",
                "Keep the password separately. It cannot be recovered.",
              )}
            </small>
          </div>
          {error && (
            <div role="alert" className="error-note">
              {error}
            </div>
          )}
          <div className="operation-transition">
            {busy ? (
              <div className="processing" role="status">
                <div>
                  <span>
                    {phase === "read"
                      ? l("خواندن فایل‌ها", "Reading files")
                      : phase === "done"
                        ? l("تکمیل شد", "Complete")
                        : l(
                            "مشتق‌سازی کلید و پردازش رمزنگاری",
                            "Deriving key and processing",
                          )}
                  </span>
                  <button className="text-link" onClick={cancel}>
                    {l("لغو", "Cancel")}
                  </button>
                </div>
                <progress value={progress} max={100} />
                <small>
                  {l(
                    "پیشرفت مرحله‌ای؛ درصد کلیدسازی قابل اندازه‌گیری نیست.",
                    "Stage progress; key derivation has no measurable percentage.",
                  )}
                </small>
              </div>
            ) : (
              <button
                className="btn primary full"
                disabled={!valid}
                onClick={run}
              >
                {action === "encrypt" ? (
                  <LockKeyhole size={18} />
                ) : (
                  <UnlockKeyhole size={18} />
                )}{" "}
                {action === "encrypt"
                  ? l("بسته رمز‌شده بساز", "Create encrypted package")
                  : l("بازیابی محتوا", "Decrypt package")}
                <ArrowUpRight size={17} />
              </button>
            )}
          </div>
        </section>
        <section className="panel output-panel">
          <div className="panel-heading">
            <span className="step-number">02</span>
            <h2>{l("خروجی شما", "Your output")}</h2>
            <span className="micro-label">
              {result
                ? l("آماده", "Ready")
                : l("منتظر ورودی", "Waiting for input")}
            </span>
          </div>
          <Swap
            id={
              result
                ? `result-${operation.current}`
                : busy
                  ? "working"
                  : "empty"
            }
            className="output-transition"
          >
            {!result ? (
              <div className="output-empty">
                {busy ? (
                  <div className="processing-reactor">
                    <Scene3D
                      kind={action === "encrypt" ? "core" : "shield"}
                      compact
                    />
                    <div className="reactor-progress-ring">
                      <span>{progress}%</span>
                    </div>
                  </div>
                ) : (
                  <SystemVisual kind="cipher" compact />
                )}
                <h3>
                  {busy
                    ? l("در حال پردازش…", "Processing…")
                    : l(
                        "نتیجه اینجا نمایش داده می‌شود.",
                        "Your result will appear here.",
                      )}
                </h3>
                <p>
                  {l(
                    "محتوا و رمز عبور را وارد کنید، سپس عملیات را اجرا کنید. ذخیره‌سازی و اشتراک بسته با انتخاب شما انجام می‌شود.",
                    "Enter your content and password, then run the operation. You choose whether to save or share the package.",
                  )}
                </p>
                <span className="empty-tag">
                  <ShieldCheck size={14} />{" "}
                  {l("روی دستگاه شما", "ON YOUR DEVICE")}
                </span>
              </div>
            ) : (
              <div className="result-content">
                <div className="success-note">
                  <Check size={17} />
                  {action === "encrypt"
                    ? l(
                        "بسته آماده است. رمز را جدا نگه دارید.",
                        "Package ready. Keep your password separately.",
                      )
                    : l(
                        "محتوا با موفقیت بازیابی شد.",
                        "Content decrypted successfully.",
                      )}
                </div>
                {result.payload ? (
                  <>
                    <label className="field-label">
                      {l("بسته قابل‌انتقال", "Portable package")}
                      <textarea
                        readOnly
                        className="cipher-output"
                        dir="ltr"
                        value={result.payload}
                      />
                    </label>
                    <div className="button-grid">
                      <button
                        className="btn secondary"
                        onClick={() => copy(result.payload!)}
                      >
                        <Copy size={16} />
                        {l("کپی بسته", "Copy package")}
                      </button>
                      <button
                        className="btn primary"
                        onClick={() =>
                          download(
                            result.payload!,
                            `pimx-${Date.now()}.pimx`,
                            "text/plain",
                          )
                        }
                      >
                        <Download size={16} />
                        {l("دانلود", "Download")}
                      </button>
                      <button
                        className="btn secondary"
                        onClick={() => setShare(true)}
                      >
                        <QrCode size={16} />
                        {l("QR و لینک", "QR & link")}
                      </button>
                      <button
                        className="btn secondary"
                        onClick={() => setSave(true)}
                      >
                        <BookmarkPlus size={16} />
                        {l("ذخیره در گاوصندوق", "Save to vault")}
                      </button>
                    </div>
                  </>
                ) : result.files ? (
                  <>
                    <div className="file-queue recovered">
                      {result.files.map((f) => (
                        <motion.div
                          key={f.name}
                          initial={animated ? { opacity: 0, y: 8 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: animated ? 0.3 : 0, ease }}
                        >
                          <File size={18} />
                          <span>
                            {f.name}
                            <small>{formatBytes(f.bytes.length)}</small>
                          </span>
                          <button
                            className="icon-btn"
                            aria-label={l("دانلود فایل", "Download file")}
                            onClick={() =>
                              download(
                                f.bytes as BlobPart,
                                f.name.split("/").pop()!,
                              )
                            }
                          >
                            <Download size={17} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    <button
                      className="btn primary full"
                      onClick={() => {
                        const map: Record<string, Uint8Array> =
                          Object.create(null);
                        result.files!.forEach((f) => {
                          map[f.name] = f.bytes;
                        });
                        download(
                          zipSync(map, { level: 0 }) as BlobPart,
                          "pimx-recovered.zip",
                        );
                      }}
                    >
                      <Download size={16} />
                      {l("دانلود همه به صورت ZIP", "Download all as ZIP")}
                    </button>
                  </>
                ) : (
                  <>
                    <textarea
                      readOnly
                      dir="auto"
                      className="recovered-text"
                      value={result.text}
                    />
                    <div className="button-grid">
                      <button
                        className="btn secondary"
                        onClick={() => copy(result.text!)}
                      >
                        <Copy size={16} />
                        {l("کپی متن", "Copy text")}
                      </button>
                      <button
                        className="btn primary"
                        onClick={() =>
                          download(
                            result.text!,
                            "pimx-recovered.txt",
                            "text/plain;charset=utf-8",
                          )
                        }
                      >
                        <Download size={16} />
                        {l("دانلود متن", "Download text")}
                      </button>
                    </div>
                  </>
                )}
                <button className="text-link centered" onClick={reset}>
                  <RefreshCw size={14} />
                  {l(
                    "شروع دوباره و پاک‌کردن جلسه",
                    "Clear session and start again",
                  )}
                </button>
              </div>
            )}
          </Swap>
        </section>
      </div>
      <div className="studio-footnotes">
        <span>
          <ShieldCheck size={18} />
          <strong>AES–256 GCM</strong>
          {l("احراز اصالت محتوا", "Authenticated content")}
        </span>
        <span>
          <KeyRound size={18} />
          <strong>600,000</strong>
          {l("دور مشتق‌سازی کلید", "Key derivation rounds")}
        </span>
        <span>
          <EyeOff size={18} />
          <strong>{l("بدون بازیابی رمز", "NO PASSWORD RECOVERY")}</strong>
          {l("رمز فقط در اختیار شماست", "Only you hold the password")}
        </span>
      </div>
      {share && result?.payload && (
        <ShareModal
          payload={result.payload}
          close={() => setShare(false)}
          toast={toast}
        />
      )}
      {save && (
        <Modal
          title={l("ذخیره در گاوصندوق", "Save to your vault")}
          close={() => setSave(false)}
        >
          {!vault.unlocked ? (
            <p className="muted">
              {l(
                "اول گاوصندوق را از صفحه «گاوصندوق من» باز کنید. سپس برای ذخیره بسته جدید به استودیو برگردید.",
                "Unlock your vault on the My vault page first, then return to the studio to save a new package.",
              )}
            </p>
          ) : (
            <>
              <label className="field-label">
                {l("عنوان", "Title")}
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                />
              </label>
              <label className="field-label">
                {l("برچسب‌ها، جداشده با کاما", "Tags, separated by commas")}
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  maxLength={250}
                />
              </label>
              <button
                className="btn primary full"
                disabled={vault.busy}
                onClick={saveItem}
              >
                {l("ذخیره رمز‌شده", "Save encrypted")}
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
function ShareModal({
  payload,
  close,
  toast,
}: {
  payload: string;
  close: () => void;
  toast: (s: string) => void;
}) {
  const { l } = usePreferences(),
    [qr, setQr] = useState(""),
    [url, setUrl] = useState(""),
    [hours, setHours] = useState(24),
    [views, setViews] = useState(1),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const alive = useRef(true);
  const [sharing, setSharing] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/health")
      .then((response) => response.json())
      .then((data) => {
        if (active)
          setSharing((data as { sharing?: boolean }).sharing === true);
      })
      .catch(() => {
        if (active) setSharing(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    const content = url || payload;
    setQr("");
    if (content.length <= 2000)
      QRCode.toDataURL(content, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: "M",
      })
        .then((q) => {
          if (active) setQr(q);
        })
        .catch(() => {});
    return () => {
      active = false;
    };
  }, [payload, url]);
  async function create() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, hours, views }),
      });
      const data = (await res.json()) as { id: string; error?: string };
      if (!res.ok) throw new Error(data.error);
      if (alive.current) setUrl(`${location.origin}/share#${data.id}`);
    } catch {
      if (alive.current)
        setError(
          l(
            "سرویس لینک در دسترس نیست؛ اتصال اینترنت و پیکربندی سرور را بررسی کنید. کپی و دانلود بسته همچنان در دسترس است.",
            "Link service unavailable. Check connectivity and server configuration. Copy and download still work.",
          ),
        );
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <Modal
      title={l("اشتراک‌گذاری با اختیار شما", "Share on your terms")}
      close={close}
    >
      <p className="muted">
        {l(
          "رمز عبور را از مسیر جدا ارسال کنید. لینک فقط تعداد دریافت از سرور را محدود می‌کند؛ نسخه دریافت‌شده قابل پس‌گرفتن نیست.",
          "Send the password separately. Links limit server downloads; received copies cannot be recalled.",
        )}
      </p>
      {qr ? (
        <div className="qr-box">
          <img
            src={qr}
            alt={l(
              "کد QR بسته یا لینک رمز‌شده",
              "QR code for encrypted package or link",
            )}
          />
          <button
            className="text-link"
            onClick={() => {
              const a = document.createElement("a");
              a.href = qr;
              a.download = "pimx-qr.png";
              a.click();
            }}
          >
            <Download size={14} />
            {l("ذخیره QR", "Save QR")}
          </button>
        </div>
      ) : (
        <p className="info-note">
          {l(
            "بسته برای QR مستقیم بزرگ است. دانلود کنید یا لینک بسازید.",
            "This package is too large for a direct QR. Download it or create a link.",
          )}
        </p>
      )}
      {url ? (
        <>
          <input
            aria-label={l("لینک اشتراک", "Share link")}
            value={url}
            readOnly
            dir="ltr"
          />
          <button
            className="btn primary full"
            onClick={async () => {
              try {
                await clipboard(url);
                toast(l("لینک کپی شد.", "Link copied."));
              } catch {
                toast(l("لینک را دستی کپی کنید.", "Copy the link manually."));
              }
            }}
          >
            <Copy size={16} />
            {l("کپی لینک", "Copy link")}
          </button>
        </>
      ) : (
        <>
          <div className="two-fields">
            <label className="field-label">
              {l("اعتبار لینک", "Link lifetime")}
              <Select
                label={l("اعتبار لینک", "Link lifetime")}
                value={hours}
                onChange={(value) => setHours(Number(value))}
                options={[
                  { value: 1, label: l("۱ ساعت", "1 hour") },
                  { value: 24, label: l("۲۴ ساعت", "24 hours") },
                  { value: 168, label: l("۷ روز", "7 days") },
                ]}
              />
            </label>
            <label className="field-label">
              {l("تعداد دریافت", "Download limit")}
              <Select
                label={l("تعداد دریافت", "Download limit")}
                value={views}
                onChange={(value) => setViews(Number(value))}
                options={[1, 3, 5, 10].map((v) => ({
                  value: v,
                  label: `${v} ${l("دریافت", "downloads")}`,
                }))}
              />
            </label>
          </div>
          <button
            className="btn primary full"
            disabled={busy || sharing !== true || payload.length > 500000}
            onClick={create}
          >
            <Link2 size={16} />
            {busy
              ? l("ساخت لینک…", "Creating…")
              : l(
                  "ارسال بسته رمز‌شده و ساخت لینک",
                  "Upload encrypted package & create link",
                )}
          </button>
          {sharing === false && (
            <p className="info-note" role="status">
              {l(
                "سرویس لینک فعلاً فعال نیست. بسته رمز‌شده را دانلود کنید و از مسیر دیگری بفرستید؛ رمز عبور را جدا ارسال کنید.",
                "Link sharing is currently disabled. Download the encrypted package and send it through another channel; send the password separately.",
              )}
            </p>
          )}
          {payload.length > 500000 && (
            <p className="info-note">
              {l(
                "حداکثر اندازه لینک ۵۰۰ کیلوبایت است؛ بسته بزرگ را به صورت فایل بفرستید.",
                "Links support up to 500 KB. Send larger packages as files.",
              )}
            </p>
          )}
        </>
      )}
      {error && (
        <p className="error-note" role="alert">
          {error}
        </p>
      )}
    </Modal>
  );
}
