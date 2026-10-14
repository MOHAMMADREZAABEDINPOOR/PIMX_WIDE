import React, { useEffect, useState } from "react";
import {
  KeyRound,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { password, randomInt } from "../services/crypto";
import { PageHeading, clipboard } from "../components/ui";
import { Select } from "../components/Select";
import { Tabs } from "../components/Tabs";
import {
  AnimatePresence,
  motion,
  Swap,
  ease,
  useMotionEnabled,
} from "../components/motion";
import wordList from "../data/eff-large-wordlist.txt?raw";
// EFF Long Wordlist; attribution and license are in THIRD_PARTY.md.
const words = wordList
  .trim()
  .split(/\r?\n/)
  .map((line) => line.split(/\s+/)[1]);
export function PasswordPage({ toast }: { toast: (s: string) => void }) {
  const { l } = usePreferences(),
    [mode, setMode] = useState<"password" | "phrase">("password"),
    [length, setLength] = useState(24),
    [count, setCount] = useState(6),
    [enabled, setEnabled] = useState([true, true, true, true]),
    [separator, setSeparator] = useState("-"),
    [result, setResult] = useState(""),
    [show, setShow] = useState(true);
  const groups = [
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "0123456789",
    "!@#$%&*-_+=?",
  ];
  const animated = useMotionEnabled();
  function generate() {
    if (mode === "phrase")
      setResult(
        Array.from(
          { length: count },
          () => words[randomInt(words.length)],
        ).join(separator),
      );
    else if (enabled.some(Boolean))
      setResult(
        password(
          length,
          groups.filter((_, i) => enabled[i]),
        ),
      );
    else setResult("");
  }
  useEffect(generate, [mode, length, count, separator, enabled]);
  const bits =
    mode === "phrase"
      ? Math.floor(count * Math.log2(words.length))
      : Math.max(
          0,
          Math.floor(
            (length - enabled.filter(Boolean).length) *
              Math.log2(
                groups.filter((_, i) => enabled[i]).join("").length || 1,
              ),
          ),
        );
  return (
    <div className="workspace wrap">
      <PageHeading
        eyebrow={l("رمزساز", "Password generator")}
        title={l("رمز عبور بسازید.", "Make a password.")}
        text={l(
          "رمز تصادفی یا عبارت عبور بسازید؛ طول و نوع کاراکترها را خودتان انتخاب کنید.",
          "Generate a random password or passphrase. Choose the length and characters.",
        )}
      />
      <div className="password-lab">
        <section className="panel generator-panel">
          <div className="panel-heading">
            <span className="tool-icon">
              <KeyRound size={22} />
            </span>
            <h2>{l("رمزساز", "Generator")}</h2>
            <span className="micro-label">
              {l("تولید روی دستگاه", "Generated locally")}
            </span>
          </div>
          <Tabs
            value={mode}
            onChange={(value) => setMode(value as "password" | "phrase")}
            items={[
              { value: "password", label: l("رمز تصادفی", "Random password") },
              { value: "phrase", label: l("عبارت عبور", "Passphrase") },
            ]}
          />
          <div className="generated-value" dir="ltr">
            <motion.output
              key={`${result}-${show}`}
              initial={animated ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: animated ? 0.25 : 0, ease }}
            >
              {show ? result || "—" : "•".repeat(24)}
            </motion.output>
            <button
              className="icon-btn"
              aria-label={l("نمایش رمز", "Toggle visibility")}
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          <div className="strength">
            <div>
              <span>{l("تصادفی بودن تخمینی", "Estimated randomness")}</span>
              <strong>{bits} bits</strong>
            </div>
            <div className="strength-track">
              <i style={{ width: `${Math.min(100, bits / 1.28)}%` }} />
            </div>
            <small>
              {l(
                "این تخمین برای خروجی تصادفی همین ابزار است؛ تضمین زمان شکستن رمز نیست.",
                "This estimate applies to this generator’s random output. It is not a cracking-time guarantee.",
              )}
            </small>
          </div>
          <div className="button-grid">
            <button
              className="btn secondary"
              disabled={!result}
              onClick={generate}
            >
              <RefreshCw size={17} />
              {l("یکی دیگه بساز", "Generate another")}
            </button>
            <button
              className="btn primary"
              disabled={!result}
              onClick={async () => {
                try {
                  await clipboard(result);
                  toast(
                    l(
                      "رمز کپی شد. پس از استفاده، کلیپ‌بورد دستگاه را پاک کنید.",
                      "Password copied. Clear your device clipboard after use.",
                    ),
                  );
                } catch {
                  toast(
                    l("رمز را دستی کپی کنید.", "Copy the password manually."),
                  );
                }
              }}
            >
              <Copy size={17} />
              {l("کپی رمز", "Copy password")}
            </button>
          </div>
        </section>
        <section className="panel generator-options">
          <div className="panel-heading">
            <SlidersHorizontal size={19} />
            <h2>{l("تنظیمات رمز", "Password options")}</h2>
          </div>
          <label className="range-label">
            {mode === "password"
              ? l("تعداد کاراکتر", "Character count")
              : l("تعداد کلمه", "Word count")}
            <strong>{mode === "password" ? length : count}</strong>
            <input
              type="range"
              min={mode === "password" ? 12 : 6}
              max={mode === "password" ? 64 : 10}
              value={mode === "password" ? length : count}
              onChange={(e) =>
                mode === "password"
                  ? setLength(+e.target.value)
                  : setCount(+e.target.value)
              }
            />
          </label>
          <Swap id={mode} className="generator-option-transition">
            {mode === "password" ? (
              [
                l("حروف کوچک", "Lowercase"),
                l("حروف بزرگ", "Uppercase"),
                l("اعداد", "Numbers"),
                l("نمادها", "Symbols"),
              ].map((g, i) => (
                <label className="toggle-row" key={g}>
                  <span>
                    {g}
                    <small>{["a–z", "A–Z", "0–9", "!@#$%"][i]}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled[i]}
                    onChange={(e) =>
                      setEnabled(
                        enabled.map((v, j) => (j === i ? e.target.checked : v)),
                      )
                    }
                  />
                </label>
              ))
            ) : (
              <label className="field-label">
                {l("جداکننده", "Separator")}
                <Select
                  label={l("جداکننده", "Separator")}
                  value={separator}
                  onChange={setSeparator}
                  options={[
                    { value: "-", label: l("خط تیره (-)", "Hyphen (-)") },
                    { value: " ", label: l("فاصله", "Space") },
                    { value: ".", label: l("نقطه (.)", "Dot (.)") },
                  ]}
                />
              </label>
            )}
          </Swap>
          <div className="subtle-note">
            <ShieldCheck size={20} />
            <span>
              {l(
                "رمزها ذخیره و به سرور ارسال نمی‌شوند. برای هر حساب رمز جدا انتخاب کنید.",
                "Passwords are neither saved nor sent to a server. Use a different password for each account.",
              )}
            </span>
          </div>
        </section>
      </div>
      <div className="info-note">
        {l(
          "عبارت‌های عبور از واژه‌های انگلیسی خوانا ساخته می‌شوند. تعداد بیشتر کلمه، تصادفی بودن بیشتری می‌دهد.",
          "Passphrases use readable English words. More words provide more randomness.",
        )}
      </div>
      <div className="subtle-note">
        <span>
          {l("منبع واژه‌ها:", "Wordlist source:")}{" "}
          <a
            className="text-link"
            href="https://www.eff.org/dice"
            target="_blank"
            rel="noreferrer"
          >
            EFF Long Wordlist
          </a>
          {" · "}
          <a
            className="text-link"
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY 4.0
          </a>
        </span>
      </div>
    </div>
  );
}
