import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Cpu,
  ChartNoAxesColumn,
  Database,
  FileText,
  Fingerprint,
  KeyRound,
  Link2,
  LockKeyhole,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { informationContent } from "../data/information";
import {
  Reveal,
  Swap,
  useMotionEnabled,
  useSceneActivity,
} from "../components/motion";
import "./information.css";
import { SystemVisual, SystemKind } from "../components/SystemVisual";
import { PrivacyPathVisual } from "../components/PrivacyPathVisual";
import { ServiceAvailability } from "./ServiceAvailability";

function Illustration({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const { prefs, l } = usePreferences();
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useSceneActivity(ref);
  return (
    <div
      ref={ref}
      data-visible="false"
      className={`information-art ${className}`}
      aria-hidden="true"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--art-x",
          `${((e.clientY - r.top - r.height / 2) / r.height) * -8}deg`,
        );
        e.currentTarget.style.setProperty(
          "--art-y",
          `${((e.clientX - r.left - r.width / 2) / r.width) * 12}deg`,
        );
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--art-x", "0deg");
        e.currentTarget.style.setProperty("--art-y", "0deg");
      }}
    >
      <div className="information-art-object">
        <img
          src={`/illustrations/${name}${prefs.theme === "light" ? "-light" : ""}${prefs.lang === "en" ? "" : `-${prefs.lang}`}.svg`}
          alt=""
          width="960"
          height="660"
        />
        <i className="art-scan" />
      </div>
      <span className="art-registration">
        {" "}
        {l("PIMX / سامانه‌های خصوصی", "PIMX / PRIVATE SYSTEMS")} <b>+</b>
      </span>
    </div>
  );
}

function PrivacyPage() {
  const { l, prefs } = usePreferences();
  const [active, setActive] = useState(0);
  const content = informationContent("privacy", l);
  const icons = [Cpu, Database, Link2, ChartNoAxesColumn, ShieldCheck];
  const labels = [
    l("روی دستگاه شما", "ON YOUR DEVICE"),
    l("ذخیره‌سازی رمزشده", "Encrypted STORAGE"),
    l("ارسال اختیاری", "OPTIONAL TRANSFER"),
    l("انتخاب شما", "YOUR CHOICE"),
    l("محدودیت‌ها را بشناسید", "KNOW THE LIMITS"),
  ];
  return (
    <div className="workspace wrap privacy-atlas">
      <header className="privacy-intro">
        <div>
          <span className="eyebrow">
            {" "}
            {l("اطلس داده‌ها / ۰۱", "THE DATA ATLAS / 01")}{" "}
          </span>
          <h1>
            {l("داده‌های تو،", "Your data.")}
            <br />
            <em>{l("مسیر روشن.", "A clear path.")}</em>
          </h1>
          <p>
            {l(
              "ببین اطلاعاتت کجا پردازش می‌شوند، کجا می‌مانند و چه زمانی از دستگاه خارج می‌شوند.",
              "See where your information is processed, where it stays, and when it leaves your device.",
            )}
          </p>
          <a className="text-link" href="#data-map">
            {l("مسیر داده‌ها را دنبال کن", "Follow the data")}{" "}
            <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="relay-art privacy-art">
          <SystemVisual kind="privacy" />
        </div>
      </header>
      <div className="privacy-boundary">
        <LockKeyhole size={18} />
        <span>
          {l(
            "متن اصلی و رمز عبور بسته، در پردازش محلی به سرور ارسال نمی‌شوند.",
            "Local processing does not send your plaintext or package password to the server.",
          )}
        </span>
        <small> {l("اولویت با پردازش محلی", "LOCAL FIRST")} </small>
      </div>
      <section
        className="privacy-map"
        id="data-map"
        aria-label={l("مسیر داده‌ها", "Data paths")}
      >
        <div className="map-heading">
          <span className="eyebrow">
            {" "}
            {l("مسیر اطلاعات خود را دنبال کنید", "TRACE YOUR INFORMATION")}{" "}
          </span>
          <h2>{l("هر مسیر را باز کن.", "Explore each path.")}</h2>
        </div>
        <div
          className="map-controls"
          role="group"
          aria-label={l("انتخاب مسیر", "Choose a path")}
        >
          {content.map(([title], i) => {
            const Icon = icons[i];
            return (
              <button
                key={labels[i]}
                aria-pressed={active === i}
                aria-controls="path-detail"
                onClick={() => setActive(i)}
              >
                <span className="path-number">0{i + 1}</span>
                <Icon size={25} />
                <strong>{title}</strong>
                <small>{labels[i]}</small>
              </button>
            );
          })}
        </div>
        <div id="path-detail" className="path-detail" aria-live="polite">
          <Swap id={String(active)}>
            <span className="eyebrow">
              0{active + 1} / {labels[active]}
            </span>
            <h3>{content[active][0]}</h3>
            <p>{content[active][1]}</p>
            {active === 3 && (
              <a className="text-link" href="/settings">
                {prefs.telemetry
                  ? l(
                      "آمار روی این دستگاه روشن است؛ تغییر تنظیمات",
                      "Analytics are enabled on this device; change preferences",
                    )
                  : l(
                      "آمار روی این دستگاه خاموش است؛ مشاهده تنظیمات",
                      "Analytics are disabled on this device; view preferences",
                    )}{" "}
                <ArrowUpRight size={14} />
              </a>
            )}
          </Swap>
          <Swap id={`path-art-${active}`} className="path-art-stage">
            <PrivacyPathVisual path={active} />
          </Swap>
        </div>
      </section>
      <div className="privacy-records">
        <div className="records-title">
          <span className="eyebrow">
            {" "}
            {l("تمام جزئیات", "THE COMPLETE RECORD")}{" "}
          </span>
          <h2>{l("تمام جزئیات، یک‌جا.", "The full picture.")}</h2>
          <p>
            {l(
              "برای مرور و مراجعه دوباره، همه مسیرها اینجا هستند.",
              "Every path is here to read and revisit.",
            )}
          </p>
        </div>
        <div>
          {content.map(([title, text], i) => (
            <Reveal key={labels[i]}>
              <section className="privacy-record">
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const { l } = usePreferences();
  const [module, setModule] = useState(0);
  const modules = [
    {
      icon: Cpu,
      code: l("۰۱ / موتور رمزنگاری", "01 / CIPHER ENGINE"),
      title: l("موتور رمزنگاری", "Cipher engine"),
      text: l(
        "متن و فایل، با Web Crypto روی همین دستگاه به بسته رمز‌شده تبدیل می‌شوند.",
        "Web Crypto turns text and files into encrypted packages on this device.",
      ),
      href: "/studio",
    },
    {
      icon: Database,
      code: l("۰۲ / گاوصندوق خصوصی", "02 / PRIVATE VAULT"),
      title: l("گاوصندوق شخصی", "Personal vault"),
      text: l(
        "عنوان، برچسب و بسته‌ها زیر رمز اصلی، در حافظه مرورگر ذخیره می‌شوند.",
        "Titles, tags and packages are stored in browser storage under your vault password.",
      ),
      href: "/vault",
    },
    {
      icon: KeyRound,
      code: l("۰۳ / کارگاه رمزها", "03 / PASSWORD LAB"),
      title: l("کارگاه رمزها", "Password lab"),
      text: l(
        "رمز و عبارت عبور بساز؛ نگهداری و انتخاب آن‌ها در اختیار خودت است.",
        "Create passwords and passphrases. You choose and keep them.",
      ),
      href: "/passwords",
    },
    {
      icon: Link2,
      code: l("۰۴ / ارسال رمزشده", "04 / Encrypted RELAY"),
      title: l("اشتراک بسته‌ها", "Package sharing"),
      text: l(
        "در استودیو، برای بسته رمز‌شده لینک با زمان اعتبار و محدودیت دریافت بساز.",
        "In the studio, create a link for an encrypted package with an expiry and download limit.",
      ),
      href: "/studio",
    },
  ];
  const content = informationContent("about", l);
  return (
    <div className="workspace wrap pimx-workshop">
      <header className="workshop-heading">
        <span className="eyebrow">
          {" "}
          {l("درون PIMX / کارگاه", "INSIDE PIMX / THE WORKSHOP")}{" "}
        </span>
        <span className="workshop-version">
          {" "}
          {l("Web Crypto / قالب نسخه ۲", "WEB CRYPTO / FORMAT V2")}{" "}
        </span>
      </header>
      <section className="workshop-stage">
        <div className="workshop-copy">
          <h1>
            {l("از درونِ", "Inside the")}
            <br />
            <em>{l("کارگاه PIMX.", "PIMX workshop.")}</em>
          </h1>
          <p>{content[0][1]}</p>
          <div className="workshop-signature">
            <Fingerprint size={28} />
            <span>
              {" "}
              {l("کلید شما.", "YOUR KEY.")} <br />{" "}
              {l("اختیار شما.", "YOUR CONTROL.")}{" "}
            </span>
          </div>
        </div>
        <Illustration name="pimx-engine" className="engine-art" />
        <div className="workshop-spec-strip">
          {[
            "AES–256–GCM",
            "PBKDF2 / SHA–256",
            l("۶۰۰٬۰۰۰ دور", "600,000 ROUNDS"),
            l("salt با ۱۶ بایت / IV با ۱۲ بایت", "16B SALT / 12B IV"),
          ].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>
      <section
        className="workbench"
        aria-label={l("اجزای پروژه", "Project modules")}
      >
        <div className="bench-heading">
          <span className="eyebrow">
            {" "}
            {l(
              "چهار ابزار / یک فضای خصوصی",
              "FOUR TOOLS / ONE PRIVATE SPACE",
            )}{" "}
          </span>
          <h2>{l("قطعه‌ها را بشناس.", "Meet the parts.")}</h2>
        </div>
        <div className="bench-layout">
          <div
            className="bench-modules"
            role="group"
            aria-label={l("انتخاب ابزار", "Choose a tool")}
          >
            {modules.map((m, i) => (
              <button
                key={m.code}
                aria-pressed={module === i}
                aria-controls="module-detail"
                onClick={() => setModule(i)}
              >
                <m.icon size={25} />
                <span>
                  <small>{m.code}</small>
                  <strong>{m.title}</strong>
                </span>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
          <div id="module-detail" className="bench-detail" aria-live="polite">
            <Swap id={String(module)}>
              <span className="eyebrow">{modules[module].code}</span>
              <h3>{modules[module].title}</h3>
              <p>{modules[module].text}</p>
              <a className="btn primary" href={modules[module].href}>
                {l("بازکردن ابزار", "Open tool")}
                <ArrowUpRight size={16} />
              </a>
            </Swap>
            <Swap id={`visual-${module}`} className="module-sculpture">
              <SystemVisual
                kind={
                  (["cipher", "archive", "key", "relay"] as SystemKind[])[
                    module
                  ]
                }
                compact
              />
            </Swap>
          </div>
        </div>
      </section>
      <div className="workshop-notes">
        {content.slice(1).map(([title, text], i) => (
          <Reveal key={title}>
            <article>
              <span className="eyebrow">
                {" "}
                {l("نکته فنی / ۰", "BUILD NOTE / 0")} {i + 1}
              </span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <a className="workshop-exit" href="/privacy">
        <ShieldCheck size={23} />
        <span>
          {l(
            "جزئیات پردازش و ذخیره‌سازی داده‌ها را بخوانید.",
            "Read about how data is processed and stored.",
          )}
        </span>
        <ArrowUpRight size={20} />
      </a>
    </div>
  );
}

function TermsPage() {
  const { l } = usePreferences();
  const enabled = useMotionEnabled();
  const content = informationContent("terms", l);
  const [current, setCurrent] = useState(0);
  const [read, setRead] = useState<number[]>([]);
  useEffect(() => {
    const chapters = content.map((_, i) =>
      document.getElementById(`term-${i}`),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0])
          setCurrent(
            Number((visible[0].target as HTMLElement).dataset.chapter),
          );
      },
      { rootMargin: "-15% 0px -45% 0px", threshold: 0 },
    );
    chapters.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [content.length]);
  return (
    <div className="workspace wrap terms-reader">
      <header className="terms-cover">
        <div>
          <span className="eyebrow">
            {" "}
            {l(
              "توافق‌نامه کاربر / PIMX WIDE",
              "THE USER AGREEMENT / PIMX WIDE",
            )}{" "}
          </span>
          <h1>
            {l("با آگاهی،", "Understand first.")}
            <br />
            <em>{l("شروع کن.", "Then begin.")}</em>
          </h1>
          <p>
            {l(
              "چهار نکته برای استفاده از فضای خصوصی‌ات. بخوان، مرور کن و مسئولیت داده‌هایت را بشناس.",
              "Four points for using your private space. Read, revisit, and understand your responsibilities.",
            )}
          </p>
          <a className="text-link" href="#term-0">
            {l("شروع مطالعه", "Start reading")}
            <ArrowUpRight size={16} />
          </a>
        </div>
        <Illustration name="terms-seal" className="seal-art" />
      </header>
      <div className="terms-layout">
        <aside className="terms-index">
          <span className="eyebrow">
            {" "}
            {l("فهرست / ۰۴ بخش", "CONTENTS / 04 CHAPTERS")}{" "}
          </span>
          <nav aria-label={l("فهرست شرایط استفاده", "Terms contents")}>
            {content.map(([title], i) => (
              <a
                key={i}
                href={`#term-${i}`}
                aria-current={current === i ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`term-${i}`)?.scrollIntoView({
                    behavior: enabled ? "smooth" : "instant",
                    block: "start",
                  });
                  setCurrent(i);
                }}
              >
                <span>0{i + 1}</span>
                <strong>{title}</strong>
                {read.includes(i) && <ShieldCheck size={15} />}
              </a>
            ))}
          </nav>
          <div className="reading-progress">
            <span>
              {l("مرور شخصی", "Your reading checklist")}{" "}
              <b>
                {read.length} / {content.length}
              </b>
            </span>
            <div
              role="progressbar"
              aria-label={l("پیشرفت مرور", "Reading checklist progress")}
              aria-valuenow={read.length}
              aria-valuemin={0}
              aria-valuemax={content.length}
            >
              <i
                style={{ width: `${(read.length / content.length) * 100}%` }}
              />
            </div>
            <small>
              {l(
                "تیک‌ها فقط برای مرور شما هستند و ذخیره نمی‌شوند.",
                "Checkmarks help you review and are not saved.",
              )}
            </small>
          </div>
          <FileText size={34} className="index-mark" />
        </aside>
        <div className="terms-paper">
          {content.map(([title, text], i) => (
            <section
              key={i}
              id={`term-${i}`}
              data-chapter={i}
              className="terms-clause"
            >
              <div className="clause-meta">
                <span>
                  {" "}
                  {l("بند / ۰", "CLAUSE / 0")} {i + 1}
                </span>
                <span>PIMX WIDE</span>
              </div>
              <h2>
                <span>0{i + 1}</span>
                {title}
              </h2>
              <p>{text}</p>
              <label className="clause-check">
                <input
                  type="checkbox"
                  checked={read.includes(i)}
                  onChange={(e) =>
                    setRead((prev) =>
                      e.target.checked
                        ? [...prev, i]
                        : prev.filter((n) => n !== i),
                    )
                  }
                />
                {l("این بخش را مرور کردم", "I have reviewed this section")}
              </label>
            </section>
          ))}
          <div className="terms-end">
            <Fingerprint size={36} />
            <h2>
              {read.length === content.length
                ? l("مرور تو کامل شد.", "Your review is complete.")
                : l("کلیدهایت را امن نگه دار.", "Keep your keys safe.")}
            </h2>
            <p>
              {l(
                "پیش از حذف اصل داده، بازیابی را امتحان کن و یک پشتیبان جدا داشته باش.",
                "Verify recovery before deleting original data, and keep a separate backup.",
              )}
            </p>
            <a className="btn primary" href="/studio">
              {l("رفتن به استودیو", "Go to the studio")}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InformationPage({ page }: { page: string }) {
  if (page === "privacy") return <PrivacyPage />;
  if (page === "about") return <AboutPage />;
  if (page === "terms") return <TermsPage />;
  return <ServiceAvailability />;
}
