import React from "react";
import { ArrowUpRight, Fingerprint, ShieldCheck } from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import type { Route } from "./Experience";
import { useMotionEnabled } from "./motion";
export function SiteFooter({ nav }: { nav: (route: Route) => void }) {
  const { l } = usePreferences();
  const animated = useMotionEnabled();
  const tools: [Route, string][] = [
    ["studio", l("استودیوی رمزنگاری", "Cipher studio")],
    ["vault", l("گاوصندوق من", "My vault")],
    ["passwords", l("رمزساز", "Password lab")],
    ["settings", l("تنظیمات", "Preferences")],
  ];
  const project: [Route, string][] = [
    ["about", l("درباره پروژه", "About the project")],
    ["privacy", l("حریم خصوصی", "Privacy")],
    ["terms", l("شرایط استفاده", "Terms")],
    ["sla", l("دسترسی به سرویس", "Service availability")],
  ];
  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <div className="footer-identity">
          <button className="footer-logotype" onClick={() => nav("home")}>
            <span>
              <Fingerprint size={29} />
            </span>
            <b>
              PIMX <em>WIDE</em>
            </b>
          </button>
          <p>
            {l(
              "ابزار رمزنگاری متن و فایل، گاوصندوق محلی و رمزساز.",
              "Text and file encryption, a local vault and a password generator.",
            )}
          </p>
          <div className="footer-local">
            <ShieldCheck size={17} />
            <span>
              {l("رمزنگاری روی دستگاه شما", "Encryption on your device")}
            </span>
          </div>
        </div>
        <section className="footer-column">
          <h2>{l("فضای کار", "Workspace")}</h2>
          {tools.map(([id, title]) => (
            <a
              key={id}
              href={`/${id}`}
              onClick={(e) => {
                e.preventDefault();
                nav(id);
              }}
            >
              {title}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </section>
        <section className="footer-column">
          <h2>{l("درباره PIMX", "About PIMX")}</h2>
          {project.map(([id, title]) => (
            <button key={id} onClick={() => nav(id)}>
              {title}
              <ArrowUpRight size={14} />
            </button>
          ))}
        </section>
      </div>
      <div className="wrap footer-bottom">
        <span>{l("رمز عبور را جدا از بسته نگه دارید.", "Keep your password separate from your package.")}</span>
        <span dir="ltr">© 2026 PIMX WIDE</span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: animated ? "smooth" : "instant",
            });
          }}
        >
          {l("بازگشت به بالا", "Back to top")}
          <ArrowUpRight size={14} />
        </a>
      </div>
    </footer>
  );
}
