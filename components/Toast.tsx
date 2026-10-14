import React, { useEffect, useRef, useState } from "react";
import { Check, Bell, X } from "lucide-react";
import { AnimatePresence, motion, ease, useMotionEnabled } from "./motion";
import { usePreferences } from "../contexts/Preferences";
export function Toast({
  message,
  id,
  dismiss,
}: {
  message: string;
  id: number;
  dismiss: () => void;
}) {
  const { l } = usePreferences();
  const enabled = useMotionEnabled();
  const [paused, setPaused] = useState(false);
  const remaining = useRef(5000),
    started = useRef(0),
    timer = useRef<ReturnType<typeof setTimeout>>(),
    current = useRef(-1);
  useEffect(() => {
    setPaused(false);
  }, [id]);
  useEffect(() => {
    if (current.current !== id) {
      remaining.current = 5000;
      current.current = id;
    }
    if (!message || paused) return;
    started.current = Date.now();
    timer.current = setTimeout(dismiss, remaining.current);
    return () => {
      clearTimeout(timer.current);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - started.current),
      );
    };
  }, [message, paused, id]);
  return (
    <div className="toast-position">
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={id}
            role="status"
            className="toast-card"
            initial={enabled ? { opacity: 0, y: 24, scale: 0.94 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: enabled ? 12 : 0,
              scale: enabled ? 0.96 : 1,
            }}
            transition={{ duration: enabled ? 0.3 : 0, ease }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <span className="toast-emblem">
              <Bell size={19} />
            </span>
            <div>
              <span className="toast-title">
                {l("اعلان PIMX", "PIMX notification")}
              </span>
              <p>{message}</p>
            </div>
            <button
              className="icon-btn"
              onClick={dismiss}
              aria-label={l("بستن", "Dismiss")}
            >
              <X size={17} />
            </button>
            <i
              key={id}
              className="toast-timer"
              style={{ animationPlayState: paused ? "paused" : "running" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
