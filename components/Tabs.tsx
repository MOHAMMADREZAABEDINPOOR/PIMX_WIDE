import React, { useId } from "react";
import { LayoutGroup } from "motion/react";
import { motion, useMotionEnabled } from "./motion";
export function Tabs({
  value,
  onChange,
  items,
  underline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string; icon?: React.ReactNode }[];
  underline?: boolean;
}) {
  const id = useId(),
    enabled = useMotionEnabled();
  return (
    <LayoutGroup id={id}>
      <div
        className={
          underline ? "input-tabs animated-tabs" : "segmented animated-tabs"
        }
      >
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            className={
              value === item.value ? (underline ? "active" : "selected") : ""
            }
            onClick={() => onChange(item.value)}
            aria-pressed={value === item.value}
          >
            {value === item.value && (
              <motion.span
                className="tab-indicator"
                layoutId="indicator"
                transition={
                  enabled
                    ? { type: "spring", stiffness: 420, damping: 36 }
                    : { duration: 0 }
                }
              />
            )}
            <span className="tab-label">
              {item.icon}
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}
