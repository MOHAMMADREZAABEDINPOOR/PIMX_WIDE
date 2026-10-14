import React, { useRef } from "react";
import {
  ArrowRight,
  Cpu,
  Database,
  FileKey2,
  FileText,
  KeyRound,
  Link2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useSceneActivity } from "./motion";
import "./system-visual.css";
import { usePreferences } from "../contexts/Preferences";

export type SystemKind = "cipher" | "archive" | "key" | "relay" | "privacy";
export function SystemVisual({
  kind,
  compact = false,
}: {
  kind: SystemKind;
  compact?: boolean;
}) {
  const { l } = usePreferences();
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useSceneActivity(ref);
  return (
    <div
      ref={ref}
      className={`system-visual visual-${kind} ${compact ? "visual-compact" : ""}`}
      data-visible="false"
      aria-hidden="true"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
          "--visual-tilt",
          `${((e.clientX - box.left - box.width / 2) / box.width) * 10}deg`,
        );
      }}
      onPointerLeave={(e) =>
        e.currentTarget.style.setProperty("--visual-tilt", "0deg")
      }
    >
      <div className="system-grid" />
      <div className="system-aura" />
      <div className="system-object">
        {kind === "cipher" && (
          <div className="cipher-apparatus">
            <div className="cipher-ring ring-first" />
            <div className="cipher-ring ring-second" />
            <div className="cipher-chip">
              <Cpu size={58} strokeWidth={1} />
              <span>AES / 256</span>
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="cipher-ticket ticket-plain">
              <FileText size={23} />
              <span> {l("ورودی", "INPUT")} </span>
              <b>•••</b>
            </div>
            <div className="cipher-ticket ticket-sealed">
              <FileKey2 size={23} />
              <span> {l("محافظت‌شده", "SEALED")} </span>
              <b>0xA7</b>
            </div>
            <div className="cipher-transfer">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
        {kind === "archive" && (
          <div className="archive-apparatus">
            <div className="archive-lid">
              <Database size={25} />
              <span> {l("آرشیو خصوصی", "PRIVATE ARCHIVE")} </span>
              <i />
            </div>
            {[0, 1, 2].map((i) => (
              <div className={`archive-drawer drawer-${i}`} key={i}>
                <span className="drawer-index">0{i + 1}</span>
                <div className="drawer-slot" />
                <FileKey2 size={22} />
                <span className="drawer-handle" />
              </div>
            ))}
            <div className="archive-lock">
              <LockKeyhole size={25} />
            </div>
            <div className="archive-file">
              <FileText size={26} />
              <i />
              <i />
              <span> {l("رمزشده", "Encrypted")} </span>
            </div>
          </div>
        )}
        {kind === "key" && (
          <div className="key-apparatus">
            <div className="key-orbit" />
            <div className="key-token">
              <KeyRound size={85} strokeWidth={1.3} />
              <span> {l("راز شما", "YOUR SECRET")} </span>
            </div>
            <div className="key-code">K7 · mQ · 9x · P4</div>
            <div className="key-dot dot-one" />
            <div className="key-dot dot-two" />
          </div>
        )}
        {kind === "relay" && (
          <div className="relay-apparatus">
            <div className="relay-path">
              <i />
              <i />
              <i />
            </div>
            <div className="relay-envelope envelope-first">
              <FileKey2 size={35} />
              <span> {l("بسته محافظت‌شده", "SEALED PACKAGE")} </span>
            </div>
            <div className="relay-envelope envelope-second">
              <ShieldCheck size={35} />
              <span> {l("ارسال خصوصی", "PRIVATE DELIVERY")} </span>
            </div>
            <div className="relay-link">
              <Link2 size={32} />
            </div>
          </div>
        )}
        {kind === "privacy" && (
          <div className="privacy-apparatus">
            <div className="privacy-window window-back" />
            <div className="privacy-window window-front">
              <div className="window-toolbar">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <b> {l("دستگاه شما", "YOUR DEVICE")} </b>
                <LockKeyhole size={15} />
              </div>
              <div className="window-workspace">
                <div className="window-input">
                  <FileText size={24} />
                  <i />
                  <i />
                  <i />
                </div>
                <ArrowRight size={20} />
                <div className="window-shield">
                  <ShieldCheck size={58} strokeWidth={1.2} />
                  <span> {l("موتور محلی", "LOCAL ENGINE")} </span>
                </div>
              </div>
              <div className="window-footer">
                <span className="live-dot" />
                <span>
                  {" "}
                  {l("طراحی‌شده برای حریم خصوصی", "PRIVATE BY DESIGN")}{" "}
                </span>
                <span>AES–256</span>
              </div>
            </div>
            <div className="privacy-keystone">
              <KeyRound size={25} />
              <span> {l("کلید شما", "YOUR KEY")} </span>
            </div>
            <div className="privacy-output">
              <FileKey2 size={27} />
              <span> {l("نسخه رمزشده", "Encrypted COPY")} </span>
            </div>
          </div>
        )}
      </div>
      {!compact && (
        <div className="system-caption">
          <span>
            {kind === "archive"
              ? l("مجموعه روی دستگاه", "ON-DEVICE COLLECTION")
              : kind === "privacy"
                ? l("داده‌های شما / اختیار شما", "YOUR DATA / YOUR CONTROL")
                : l("موتور رمزنگاری محلی", "LOCAL CIPHER ENGINE")}
          </span>
          <span>+</span>
        </div>
      )}
    </div>
  );
}
