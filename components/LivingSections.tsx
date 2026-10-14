import React, { useState } from "react";
import {
  Cpu,
  KeyRound,
  ShieldCheck,
  LockKeyhole,
  ArrowUpRight,
  WifiOff,
  Link2,
  Fingerprint,
  EyeOff,
  FileText,
  Check,
  Sparkles,
  Globe2,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import type { Route } from "./Experience";
import { Scene3D } from "./Scene3D";
import { Reveal, Swap, motion, Ambient } from "./motion";
export function LivingSections({
  nav,
  lock,
}: {
  nav: (r: Route) => void;
  lock: () => void;
}) {
  const { l } = usePreferences(),
    [layer, setLayer] = useState(2),
    [connection, setConnection] = useState(0);
  const layers = [
    {
      icon: FileText,
      title: l("ورودی شما", "Your input"),
      tag: "01 / ORIGINAL",
      text: l(
        "متن و فایل‌ها روی دستگاه شما خوانده می‌شوند؛ نام فایل‌ها داخل بسته رمز‌شده قرار می‌گیرد.",
        "Text and files are read on your device. Filenames stay inside the encrypted package.",
      ),
    },
    {
      icon: KeyRound,
      title: l("رمز عبور شما", "Your password"),
      tag: "02 / KEY DERIVATION",
      text: l(
        "کلید از رمز عبور و یک salt تصادفی مشتق می‌شود. رمز عبور در خروجی بسته قرار نمی‌گیرد.",
        "A key is derived from your password and a random salt. Your password is never included in the package.",
      ),
    },
    {
      icon: ShieldCheck,
      title: l("بسته رمز‌شده", "Encrypted package"),
      tag: "03 / AES–256 GCM",
      text: l(
        "محتوا با رمزنگاری احرازشده محافظت می‌شود. بسته را دانلود کنید و رمز عبور را جدا نگه دارید.",
        "Authenticated encryption protects the content. Download the package and keep the password separately.",
      ),
    },
    {
      icon: LockKeyhole,
      title: l("گاوصندوق شما", "Your vault"),
      tag: "04 / DEVICE VAULT",
      text: l(
        "اگر بخواهید، بسته در گاوصندوق دستگاه ذخیره می‌شود. عنوان‌ها و برچسب‌ها هم با رمز اصلی گاوصندوق رمز می‌شوند.",
        "If you choose, save the package in your device vault. Its titles and tags are encrypted with the vault password too.",
      ),
    },
  ];
  const modes = [
    {
      icon: Cpu,
      title: l("روی دستگاه", "On your device"),
      tag: "Local processing",
      text: l(
        "رمزکردن و بازیابی متن و فایل در مرورگر انجام می‌شود. برای شروع، نیازی به حساب کاربری نیست.",
        "Text and file encryption happens in the browser. You do not need an account to start.",
      ),
    },
    {
      icon: Link2,
      title: l("با انتخاب شما", "By your choice"),
      tag: "Encrypted SHARING",
      text: l(
        "فقط وقتی لینک می‌سازید، نسخه رمز‌شده ارسال می‌شود. رمز عبور را از مسیر دیگری به گیرنده برسانید.",
        "Only when you create a link is the encrypted copy uploaded. Send the password through a separate channel.",
      ),
    },
    {
      icon: WifiOff,
      title: l("حتی بدون شبکه", "Even offline"),
      tag: "OFFLINE TOOLS",
      text: l(
        "بعد از بارگذاری کامل نسخه انتشار، ابزارهای محلی همراه شما می‌مانند. سرویس لینک به شبکه نیاز دارد.",
        "After the production app is fully cached, local tools stay with you. Link sharing still needs a connection.",
      ),
    },
  ];
  return (
    <>
      <Reveal className="cinema-section wrap">
        <div className="cinema-stage">
          <div className="cinema-stage-grid" />
          <div className="cinema-heading">
            <span className="eyebrow">How encryption works</span>
            <span className="micro-label">A VISUAL LOOK INSIDE</span>
          </div>
          <div className="cinema-content">
            <div className="cinema-art">
              <Scene3D kind="core" />
              <div className="cipher-ticker" aria-hidden="true">
                <span>
                  PIMX · 256 · KEY · CIPHER · LOCAL · PIMX · 256 · KEY · CIPHER
                  · LOCAL ·{" "}
                </span>
              </div>
            </div>
            <div className="cinema-copy">
              <span className="outlined-index">01</span>
              <h2>
                {l("متن و فایل شما", "Your text and files")}
                <br />
                <span>{l("در یک بسته رمز‌شده", "in an encrypted package")}</span>
              </h2>
              <p>
                {l(
                  "محتوا و رمز عبور را در استودیو وارد کنید. بسته‌ای که می‌گیرید با همان رمز باز می‌شود.",
                  "Enter your content and password in the studio. The resulting package opens with the same password.",
                )}
              </p>
              <div className="cipher-flow">
                <span>
                  <FileText size={14} /> INPUT
                </span>
                <i />
                <span>
                  <KeyRound size={14} /> KEY
                </span>
                <i />
                <span>
                  <ShieldCheck size={14} /> CIPHER
                </span>
              </div>
              <button className="btn primary" onClick={() => nav("studio")}>
                {l("اولین بسته‌ات رو بساز", "Create your first package")}
                <ArrowUpRight size={18} />
              </button>
              <small className="cinema-disclaimer">
                {l(
                  "نمایش بصری مراحل؛ رمزنگاری واقعی در استودیو انجام می‌شود.",
                  "A visual illustration. Actual encryption takes place in the studio.",
                )}
              </small>
            </div>
          </div>
          <div className="cinema-baseline">
            <span>YOUR CONTENT / YOUR KEY / YOUR CONTROL</span>
            <i className="live-dot" />
            <span>DESIGNED TO STAY PERSONAL</span>
          </div>
        </div>
      </Reveal>
      <section className="layers-section wrap section">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE THE LAYERS</span>
            <h2>
              {l("مسیر رمزنگاری", "The encryption process")}
              <br />
              <span className="muted">
                {l("از ورودی تا ذخیره‌سازی", "From input to storage")}
              </span>
            </h2>
          </div>
          <p>
            {l(
              "هر مرحله را انتخاب کنید تا ببینید با محتوا و رمز عبورتان چه اتفاقی می‌افتد.",
              "Choose a stage to explore how your data is handled.",
            )}
          </p>
        </Reveal>
        <div className="layers-explorer">
          <Reveal className="layers-sculpture">
            <Scene3D kind="layers" active={layer} />
            <span className="layers-caption">INTERACTIVE / 0{layer + 1}</span>
          </Reveal>
          <Reveal className="layers-controls">
            <div className="layer-options">
              {layers.map((item, i) => (
                <button
                  key={item.tag}
                  className={layer === i ? "active" : ""}
                  aria-pressed={layer === i}
                  onClick={() => setLayer(i)}
                >
                  <span>0{i + 1}</span>
                  <item.icon size={19} />
                  <span>{item.title}</span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
            <Swap id={String(layer)} className="layer-description">
              <span className="eyebrow">{layers[layer].tag}</span>
              <p>{layers[layer].text}</p>
            </Swap>
          </Reveal>
        </div>
      </section>
      <Reveal className="connection-section wrap">
        <div className="connection-copy">
          <span className="eyebrow">CONNECTED WORLD / PRIVATE SPACE</span>
          <h2>
            {l("چه زمانی داده ارسال می‌شود؟", "When does data leave your device?")}
            <br />
            <span>{l("اشتراک لینک اختیاری است.", "The choice stays this device.")}</span>
          </h2>
          <div className="connection-options">
            {modes.map((m, i) => (
              <button
                key={m.tag}
                className={connection === i ? "active" : ""}
                aria-pressed={connection === i}
                onClick={() => setConnection(i)}
              >
                <m.icon size={17} />
                {m.title}
              </button>
            ))}
          </div>
          <Swap id={String(connection)} className="connection-description">
            <span className="micro-label">{modes[connection].tag}</span>
            <p>{modes[connection].text}</p>
          </Swap>
          <button className="text-link" onClick={() => nav("privacy")}>
            {l("مسیر داده‌ها رو ببین", "Follow the path of your data")}
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="connection-art">
          <Scene3D kind="network" />
          <span className="network-mode-label">
            <i className="live-dot" />
            {modes[connection].tag}
          </span>
        </div>
      </Reveal>
      <Reveal className="panic-section wrap">
        <Ambient className="panic-sculpture">
          <div className="panic-scan" />
          <div className="panic-fingerprint">
            <Fingerprint size={110} strokeWidth={0.8} />
          </div>
          <div className="panic-ring" />
          <div className="panic-ring second" />
          <span>ONE TOUCH / YOUR PRIVACY</span>
        </Ambient>
        <div>
          <span className="eyebrow">TAKE BACK YOUR SPACE</span>
          <h2>
            {l("قفل سریع", "Quick lock")}
            <br />
            <span>{l("برای پایان جلسه", "to end your session")}</span>
          </h2>
          <p>
            {l(
              "قفل سریع ورودی‌ها و خروجی‌های جلسه را پاک می‌کند و گاوصندوق را می‌بندد. نسخه ذخیره‌شده گاوصندوق رمز‌شده باقی می‌ماند.",
              "Quick lock clears session inputs and outputs and closes the vault. Your saved vault stays encrypted.",
            )}
          </p>
          <button className="btn secondary" onClick={lock}>
            <EyeOff size={17} />
            {l("قفل سریع را امتحان کن", "Try quick lock")}
            <span className="button-shortcut">Ctrl ⇧ L</span>
          </button>
        </div>
      </Reveal>
    </>
  );
}
