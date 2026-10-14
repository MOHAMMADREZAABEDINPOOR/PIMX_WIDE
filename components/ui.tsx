import React, { useEffect, useRef } from "react";
import { X, ArrowUpRight, ShieldCheck, LockKeyhole } from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { useMotionEnabled, useSceneActivity } from "./motion";
export function PageHeading({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {children}
    </div>
  );
}
export function Modal({
  title,
  close,
  children,
  canClose = true,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
  canClose?: boolean;
}) {
  const { l } = usePreferences();
  const enabled = useMotionEnabled();
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const exitAnimation = useRef<Animation | null>(null);
  function dismiss() {
    if (closing.current || !canClose) return;
    closing.current = true;
    if (!enabled || !ref.current) {
      close();
      return;
    }
    const a = ref.current.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 140,
      easing: "ease-out",
      fill: "forwards",
    });
    exitAnimation.current = a;
    a.onfinish = close;
  }
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => {
      exitAnimation.current?.cancel();
      d.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          className="icon-btn"
          disabled={!canClose}
          onClick={dismiss}
          aria-label={l("بستن", "Close")}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function VaultVisual({
  compact = false,
  locked = false,
}: {
  compact?: boolean;
  locked?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useSceneActivity(ref);
  return (
    <div
      className={`vault-scene ${compact ? "compact" : ""} ${locked ? "sealed" : ""}`}
      ref={ref}
      data-visible="false"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ref.current?.style.setProperty(
          "--rx",
          `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`,
        );
        ref.current?.style.setProperty(
          "--ry",
          `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`,
        );
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--rx", "0deg");
        ref.current?.style.setProperty("--ry", "0deg");
      }}
      aria-hidden="true"
    >
      <div className="scene-grid" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="vault-shadow" />
      <div className="vault-body">
        <div className="vault-side" />
        <div className="vault-face">
          <div className="vault-stamp">
            PIMX <span>PRIVATE BY DESIGN</span>
          </div>
          <div className="bolt b1" />
          <div className="bolt b2" />
          <div className="bolt b3" />
          <div className="bolt b4" />
          <div className="vault-door">
            <div className="dial">
              <div className="dial-inner">
                <LockKeyhole size={28} />
              </div>
              <div className="dial-arm a1" />
              <div className="dial-arm a2" />
              <div className="dial-arm a3" />
            </div>
          </div>
          <div className="vault-status">
            <i /> AES–256 · LOCAL ENGINE
          </div>
        </div>
      </div>
      <div className="scene-label label-one">
        <ShieldCheck size={15} /> Encrypted AT SOURCE
      </div>
      <div className="scene-label label-two">
        01 / YOUR EYES ONLY <ArrowUpRight size={14} />
      </div>
      <div className="scene-cross cross-one">+</div>
      <div className="scene-cross cross-two">+</div>
    </div>
  );
}
export async function clipboard(text: string) {
  await navigator.clipboard.writeText(text);
}
