import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePreferences } from "../contexts/Preferences";
export { AnimatePresence, motion };
export const ease = [0.22, 1, 0.36, 1] as const;
const reducedMotionQuery = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribeReducedMotion = (notify: () => void) => {
  const query = reducedMotionQuery();
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const readReducedMotion = () => reducedMotionQuery().matches;
export function useMotionEnabled() {
  const { prefs } = usePreferences();
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    () => true,
  );
  return prefs.motion && !reduced;
}
export function useSceneActivity(ref: React.RefObject<HTMLDivElement>) {
  const enabled = useMotionEnabled();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.visible = String(
          entry.isIntersecting && enabled && !document.hidden,
        );
      },
      { rootMargin: "60px" },
    );
    const visibility = () => {
      const r = element.getBoundingClientRect();
      element.dataset.visible = String(
        enabled &&
          !document.hidden &&
          r.bottom > -60 &&
          r.top < innerHeight + 60,
      );
    };
    observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [enabled, ref]);
  return enabled;
}
export function Ambient({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSceneActivity(ref);
  return (
    <div
      ref={ref}
      data-visible="false"
      aria-hidden="true"
      className={`ambient-scene ${className}`}
    >
      {children}
    </div>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
export function Swap({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  const enabled = useMotionEnabled();
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={id}
        className={className}
        initial={enabled ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: enabled ? -8 : 0,
          transition: { duration: enabled ? 0.12 : 0 },
        }}
        transition={{ duration: enabled ? 0.3 : 0, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
