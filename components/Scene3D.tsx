import React, { useEffect, useRef } from "react";
import {
  Fingerprint,
  ShieldCheck,
  KeyRound,
  LockKeyhole,
  FileText,
  Cpu,
  WifiOff,
  Sparkles,
} from "lucide-react";
import { useMotionEnabled } from "./motion";
export type SceneKind =
  "core" | "shield" | "layers" | "network" | "folio" | "settings";
export function Scene3D({
  kind = "core",
  compact = false,
  active = 0,
}: {
  kind?: SceneKind;
  compact?: boolean;
  active?: number;
}) {
  const ref = useRef<HTMLDivElement>(null),
    frame = useRef(0);
  const enabled = useMotionEnabled();
  useEffect(() => {
    const element = ref.current!;
    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.visible = String(entry.isIntersecting && enabled);
      },
      { rootMargin: "60px" },
    );
    observer.observe(element);
    const visibility = () => {
      element.dataset.visible = String(
        !document.hidden &&
          enabled &&
          element.getBoundingClientRect().bottom > 0 &&
          element.getBoundingClientRect().top < innerHeight + 60,
      );
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      cancelAnimationFrame(frame.current);
    };
  }, [enabled]);
  const reset = () => {
    cancelAnimationFrame(frame.current);
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  };
  return (
    <div
      ref={ref}
      className={`scene-3d scene-${kind} ${compact ? "scene-small" : ""}`}
      data-visible="false"
      aria-hidden="true"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          ref.current?.style.setProperty("--tilt-x", `${(y - 0.5) * -14}deg`);
          ref.current?.style.setProperty("--tilt-y", `${(x - 0.5) * 18}deg`);
        });
      }}
      onPointerLeave={reset}
    >
      <div className="scene-halo" />
      <div className="scene-floor" />
      <div className="scene-starfield">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="scene-orbit outer-orbit" />
      <div className="scene-orbit inner-orbit" />
      <div className="scene-coordinate coordinate-top">
        PIMX / {kind.toUpperCase()}
        <span>+</span>
      </div>
      <div className="scene-coordinate coordinate-bottom">
        PRIVATE SYSTEMS / 02<span>+</span>
      </div>
      <div className="scene-object">
        {kind === "core" && (
          <div className="cube-gimbal">
            <div className="cube-3d">
              {["front", "back", "left", "right", "top", "bottom"].map(
                (face, i) => (
                  <div className={`cube-face cube-${face}`} key={face}>
                    <span className="cube-circuit" />
                    {i === 0 ? (
                      <Fingerprint size={55} />
                    ) : i === 3 ? (
                      <LockKeyhole size={44} />
                    ) : (
                      <span className="cube-face-code">
                        {["", "PIMX", "256", "", "LOCAL", "02"][i]}
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
            <div className="gimbal-ring ring-a" />
            <div className="gimbal-ring ring-b" />
          </div>
        )}
        {kind === "shield" && (
          <div className="shield-sculpture">
            <div className="shield-echo echo-a" />
            <div className="shield-echo echo-b" />
            <div className="shield-plate">
              <div className="shield-engraving">
                <ShieldCheck size={74} strokeWidth={1.2} />
                <span>YOUR KEY. YOUR CONTROL.</span>
              </div>
            </div>
            <div className="shield-orbit">
              <i />
            </div>
          </div>
        )}
        {kind === "layers" && (
          <div className="glass-stack">
            {[0, 1, 2, 3].map((i) => (
              <div
                className={`glass-plane ${i === active ? "lit" : ""}`}
                key={i}
                style={{ "--layer": i } as React.CSSProperties}
              >
                <span className="plane-code">
                  0{i + 1} / {["INPUT", "KEY", "CIPHER", "VAULT"][i]}
                </span>
                {i === 0 ? (
                  <FileText size={38} />
                ) : i === 1 ? (
                  <KeyRound size={38} />
                ) : i === 2 ? (
                  <ShieldCheck size={38} />
                ) : (
                  <LockKeyhole size={38} />
                )}
                <span className="plane-cross">+</span>
              </div>
            ))}
          </div>
        )}
        {kind === "network" && (
          <div className="network-sculpture">
            <div className="network-globe">
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
            <div className="network-heart">
              <Fingerprint size={45} />
            </div>
            {[Cpu, LockKeyhole, WifiOff, KeyRound].map((Icon, i) => (
              <div key={i} className={`network-node node-${i}`}>
                <Icon size={23} />
                <i />
              </div>
            ))}
            <svg className="network-lines" viewBox="0 0 300 300">
              <path d="M150 150L60 70M150 150L235 55M150 150L250 220M150 150L65 235" />
            </svg>
          </div>
        )}
        {kind === "folio" && (
          <div className="folio-sculpture">
            <div className="folio-page folio-back" />
            <div className="folio-page folio-mid" />
            <div className="folio-page folio-front">
              <span className="folio-masthead">PIMX / AGREEMENT</span>
              <div className="folio-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="folio-seal">
                <ShieldCheck size={34} />
              </div>
              <span className="folio-signature">Your data. Your choice.</span>
            </div>
            <div className="folio-quill">
              <KeyRound size={32} />
            </div>
          </div>
        )}
        {kind === "settings" && (
          <div className="control-sculpture">
            <div className="control-panel">
              <div className="control-orb">
                <Fingerprint size={52} />
              </div>
              <div className="control-grid">
                <span />
                <span />
                <span />
                <span />
              </div>
              <span className="control-caption">YOUR SPACE / YOUR RULES</span>
            </div>
            <div className="control-satellite">
              <Sparkles size={23} />
            </div>
          </div>
        )}
      </div>
      <div className="scene-floating-chip">
        <i className="live-dot" />{" "}
        {kind === "folio"
          ? "CLEAR BY DESIGN"
          : kind === "settings"
            ? "PERSONAL BY DESIGN"
            : "PRIVATE BY DESIGN"}
      </div>
    </div>
  );
}
