import React, { useState } from "react";
import {
  ArrowUpRight,
  FileLock2,
  LockKeyhole,
  KeyRound,
  Link2,
  ShieldCheck,
  Fingerprint,
  WifiOff,
  Plus,
  Minus,
  Check,
  Sparkles,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import type { Route } from "../components/Experience";
import { Modal } from "../components/ui";
import { open, seal, portable, utf8 } from "../services/crypto";
import { LivingSections } from "../components/LivingSections";
import {
  AnimatePresence,
  motion,
  ease,
  useMotionEnabled,
} from "../components/motion";

export function Landing({
  nav,
  lock,
}: {
  nav: (r: Route) => void;
  lock: () => void;
}) {
  const { l } = usePreferences();
  const animated = useMotionEnabled();
  const [demo, setDemo] = useState(false);
  const [faq, setFaq] = useState<number | null>(null);
  const tools = [
    {
      icon: FileLock2,
      route: "studio" as Route,
      title: l("رمزنگاری متن و فایل", "Encrypt text and files"),
      text: l(
        "متن، فایل یا یک پوشه را با رمز عبور به بسته رمز‌شده تبدیل کنید.",
        "Turn a message, file or folder into a password-protected package.",
      ),
      action: l("بازکردن استودیو", "Open studio"),
    },
    {
      icon: LockKeyhole,
      route: "vault" as Route,
      title: l("گاوصندوق من", "My vault"),
      text: l(
        "بسته‌ها را روی همین دستگاه نگه دارید؛ با رمز جداگانه، عنوان و برچسب.",
        "Keep packages on this device with a separate password, titles and tags.",
      ),
      action: l("بازکردن گاوصندوق", "Open vault"),
    },
    {
      icon: KeyRound,
      route: "passwords" as Route,
      title: l("رمزساز", "Password generator"),
      text: l(
        "رمز تصادفی یا عبارت عبور بسازید و طول و کاراکترهایش را انتخاب کنید.",
        "Make a random password or passphrase. Choose its length and characters.",
      ),
      action: l("ساختن رمز", "Make a password"),
    },
  ];
  const questions = [
    [
      l(
        "آیا متن و فایل من به سرور ارسال می‌شود؟",
        "Are my text and files sent to a server?",
      ),
      l(
        "رمزنگاری و رمزگشایی در مرورگر انجام می‌شود. اگر لینک اشتراک بسازید، فقط بسته رمز‌شده به سرور می‌رود. رمز عبور و متن اصلی ارسال نمی‌شوند.",
        "Encryption and decryption happen in your browser. If you create a share link, only the encrypted package is uploaded. Your password and original content are never sent.",
      ),
    ],
    [
      l(
        "اگر رمز عبورم را فراموش کنم چه می‌شود؟",
        "What happens if I forget my password?",
      ),
      l(
        "بازیابی رمز وجود ندارد. رمز را در جای مطمئن و جدا از بسته نگه دارید. پیش از حذف فایل اصلی، بازکردن بسته را امتحان کنید.",
        "There is no password recovery. Keep the password somewhere reliable, separate from the package. Try decrypting the package before deleting the original.",
      ),
    ],
    [
      l(
        "لینک یک‌بارمصرف چه محدودیتی دارد؟",
        "What does a single-use link limit?",
      ),
      l(
        "سرور پس از پایان اعتبار یا رسیدن به تعداد دریافت مشخص، بسته را تحویل نمی‌دهد. نسخه‌ای که گیرنده قبلاً دانلود کرده باقی می‌ماند.",
        "The server stops delivering the package after its expiry or download limit. A copy the recipient has already downloaded remains available to them.",
      ),
    ],
    [
      l("بدون اینترنت هم کار می‌کند؟", "Does it work offline?"),
      l(
        "بعد از بارگذاری کامل و ذخیره‌شدن نسخه انتشار در مرورگر، ابزارهای محلی آفلاین کار می‌کنند. ساخت و دریافت لینک اشتراک به اینترنت نیاز دارد؛ آمار مدیریت هم آنلاین است.",
        "After the production app is fully loaded and cached, local tools work offline. Creating and retrieving share links needs internet access, as do admin analytics.",
      ),
    ],
  ];
  return (
    <div className="home-redesign">
      <section className="private-desk wrap">
        <div className="desk-copy">
          <span className="desk-context">
            <ShieldCheck size={18} />
            {l("رمزنگاری در مرورگر شما", "Encryption in your browser")}
          </span>
          <h1>
            {l(
              "فایل‌های شخصی را با رمز نگه دارید.",
              "Keep your personal files under lock.",
            )}
          </h1>
          <p>
            {l(
              "متن یا فایل را انتخاب کنید، رمز بگذارید و بسته‌اش را دانلود کنید. برای شروع به حساب کاربری نیاز ندارید.",
              "Choose a message or file, set a password and download the encrypted package. You can start without an account.",
            )}
          </p>
          <div className="desk-actions">
            <button className="btn primary" onClick={() => nav("studio")}>
              <FileLock2 size={19} />
              {l("شروع رمزنگاری", "Start encrypting")}
            </button>
            <button className="btn secondary" onClick={() => setDemo(true)}>
              {l("امتحان با پیام نمونه", "Try a sample message")}
            </button>
          </div>
          <div className="desk-assurances">
            <span>
              <Fingerprint size={16} />
              {l("بدون حساب کاربری", "No account needed")}
            </span>
            <span>
              <WifiOff size={16} />
              {l(
                "ابزارهای محلی با پشتیبانی آفلاین",
                "Local tools with offline support",
              )}
            </span>
          </div>
        </div>
        <div className="package-desk" aria-hidden="true">
          <div className="desk-document">
            <FileLock2 size={25} />
            <span>{l("یادداشت شخصی", "Personal note")}</span>
            <div />
            <div />
            <div />
          </div>
          <div className="sealed-package">
            <div className="package-top">
              <span>PIMX WIDE</span>
              <LockKeyhole size={18} />
            </div>
            <div className="package-lock">
              <LockKeyhole size={36} strokeWidth={1.4} />
            </div>
            <span className="package-name">personal.pimx</span>
            <span className="package-description">
              {l("بسته رمز‌شده", "Encrypted package")}
            </span>
            <div className="package-bottom">
              <span>AES-256-GCM</span>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="desk-key">
            <KeyRound size={19} />
            <span>
              {l("رمز عبور را جدا نگه دارید", "Keep the password separately")}
            </span>
          </div>
        </div>
      </section>
      <section className="tool-shelf wrap" aria-labelledby="tools-title">
        <div className="shelf-heading">
          <h2 id="tools-title">
            {l("چه کاری می‌خواهید انجام دهید؟", "What would you like to do?")}
          </h2>
          <span>{l("روی همین دستگاه", "On this device")}</span>
        </div>
        <div className="shelf-tools">
          {tools.map((tool) => (
            <button
              key={tool.route}
              className="shelf-tool"
              onClick={() => nav(tool.route)}
            >
              <tool.icon size={25} strokeWidth={1.5} />
              <h3>{tool.title}</h3>
              <p>{tool.text}</p>
              <span>
                {tool.action}
                <ArrowUpRight size={17} />
              </span>
            </button>
          ))}
        </div>
        <div className="sharing-note">
          <Link2 size={21} />
          <p>
            {l(
              "برای فرستادن بسته، در استودیو لینک با زمان اعتبار و تعداد دریافت مشخص بسازید. رمز عبور را از مسیر دیگری بفرستید.",
              "To send a package, create a link in the studio with an expiry and download limit. Send the password through a separate channel.",
            )}
          </p>
          <button className="text-link" onClick={() => nav("studio")}>
            {l("اشتراک بسته", "Share a package")}
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
      <LivingSections nav={nav} lock={lock} />
      <section className="desk-faq wrap" aria-labelledby="faq-title">
        <div>
          <h2 id="faq-title">{l("قبل از شروع", "Before you start")}</h2>
          <p>
            {l(
              "درباره رمز عبور، اشتراک و نگهداری فایل‌ها.",
              "About passwords, sharing and keeping your files.",
            )}
          </p>
          <button className="text-link" onClick={() => nav("privacy")}>
            {l("جزئیات حریم خصوصی", "Privacy details")}
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="desk-questions">
          {questions.map(([question, answer], i) => (
            <div className="desk-question" key={question}>
              <h3>
                <button
                  aria-expanded={faq === i}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {question}
                  <span
                    className={`faq-mark ${faq === i ? "expanded" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {faq === i && (
                  <motion.div
                    key={`answer-${i}`}
                    className="faq-answer-reveal"
                    initial={{
                      height: animated ? 0 : "auto",
                      opacity: animated ? 0 : 1,
                    }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: animated ? 0.34 : 0, ease }}
                  >
                    <p id={`faq-answer-${i}`}>{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      {demo && <Demo close={() => setDemo(false)} />}
    </div>
  );
}
function Demo({ close }: { close: () => void }) {
  const { l } = usePreferences(),
    [text, setText] = useState(
      l("قرارمان فردا ساعت ده است.", "Let’s meet tomorrow at ten."),
    ),
    [cipher, setCipher] = useState(""),
    [recovered, setRecovered] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function run() {
    setBusy(true);
    setError("");
    try {
      const p = portable(await seal(utf8(text), "demo-only-password", "text"));
      setCipher(p);
      setRecovered("");
    } catch {
      setError(
        l(
          "مرورگر از رمزنگاری پشتیبانی نمی‌کند.",
          "Cryptography is unavailable in this browser.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={l("رمزنگاری یک پیام نمونه", "Encrypt a sample message")}
      close={close}
    >
      <p className="muted">
        {l(
          "این دمو از رمز نمونه استفاده می‌کند؛ برای محتوای واقعی وارد استودیو شوید.",
          "This demo uses a sample password. Use the studio for real content.",
        )}
      </p>
      <label className="field-label">
        {l("پیام نمونه", "Sample message")}
        <textarea
          value={text}
          maxLength={1000}
          onChange={(e) => {
            setText(e.target.value);
            setCipher("");
            setRecovered("");
          }}
        />
      </label>
      <button
        className="btn primary full"
        disabled={busy || !text}
        onClick={run}
      >
        <Sparkles size={18} />
        {busy
          ? l("در حال رمزنگاری…", "Encrypting…")
          : l("تبدیل به بسته رمز‌شده", "Make an encrypted package")}
      </button>
      {cipher && (
        <div className="demo-output">
          <span className="eyebrow">
            {l("بسته رمز‌شده", "Encrypted package")}
          </span>
          <pre>{cipher.slice(0, 160)}…</pre>
          <button
            className="btn secondary"
            onClick={async () => {
              try {
                setRecovered(
                  new TextDecoder().decode(
                    (await open(cipher, "demo-only-password")).bytes,
                  ),
                );
              } catch {
                setError(
                  l(
                    "پیام نمونه باز نشد. دوباره آن را رمز کنید.",
                    "Could not decrypt the sample. Try encrypting it again.",
                  ),
                );
              }
            }}
          >
            {l("حالا بازیابی کن", "Now decrypt it")}
            <KeyRound size={16} />
          </button>
        </div>
      )}
      {recovered && (
        <div className="success-note">
          <Check size={18} />
          {recovered}
        </div>
      )}
      {error && <p className="error-note">{error}</p>}
    </Modal>
  );
}
