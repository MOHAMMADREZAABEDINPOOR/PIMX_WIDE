import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, ease, useMotionEnabled } from "./motion";
import { usePreferences } from "../contexts/Preferences";
export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}
export function Select({
  value,
  onChange,
  options,
  label,
  disabled = false,
  compact = false,
}: {
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string;
  disabled?: boolean;
  compact?: boolean;
}) {
  const { prefs } = usePreferences();
  const animate = useMotionEnabled();
  const id = useId();
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0),
    [position, setPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
      maxHeight: 240,
    });
  const trigger = useRef<HTMLButtonElement>(null),
    popup = useRef<HTMLDivElement>(null),
    typeahead = useRef(""),
    timeout = useRef<ReturnType<typeof setTimeout>>();
  const selected =
    options.find((o) => String(o.value) === String(value)) || options[0];
  function place() {
    const r = trigger.current?.getBoundingClientRect();
    if (!r) return;
    const viewportHeight = window.visualViewport?.height || innerHeight;
    const viewportTop = window.visualViewport?.offsetTop || 0;
    const availableBelow = viewportHeight + viewportTop - r.bottom - 14,
      availableAbove = r.top - viewportTop - 14;
    const height = Math.min(options.length * 55 + 12, 300);
    const above =
      availableBelow < Math.min(height, 160) && availableAbove > availableBelow;
    const maxHeight = Math.max(
      90,
      Math.min(height, above ? availableAbove : availableBelow),
    );
    setPosition({
      left: Math.max(8, Math.min(r.left, innerWidth - r.width - 8)),
      top: above ? r.top - maxHeight - 7 : r.bottom + 7,
      width: Math.min(r.width, innerWidth - 16),
      maxHeight,
    });
  }
  function show(
    index = options.findIndex((o) => String(o.value) === String(value)),
  ) {
    setActive(Math.max(0, index));
    place();
    setOpen(true);
  }
  function choose(index: number) {
    onChange(String(options[index].value));
    setOpen(false);
    trigger.current?.focus();
  }
  useLayoutEffect(() => {
    if (open) place();
  }, [open, options.length]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (
        !trigger.current?.contains(e.target as Node) &&
        !popup.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    const scroll = (e: Event) => {
      if (!popup.current?.contains(e.target as Node)) place();
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", scroll, true);
    window.visualViewport?.addEventListener("resize", place);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", scroll, true);
      window.visualViewport?.removeEventListener("resize", place);
    };
  }, [open]);
  useEffect(() => {
    if (open)
      popup.current
        ?.querySelector(`[data-index="${active}"]`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);
  useEffect(() => () => clearTimeout(timeout.current), []);
  function key(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
        "Enter",
        " ",
        "Escape",
        "Tab",
      ].includes(e.key)
    ) {
      if (e.key === "Tab") {
        setOpen(false);
        return;
      }
      e.preventDefault();
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        if (open) choose(active);
        else show();
        return;
      }
      if (!open) {
        show(
          e.key === "End"
            ? options.length - 1
            : e.key === "Home"
              ? 0
              : undefined,
        );
        return;
      }
      setActive((i) =>
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? options.length - 1
            : (i + (e.key === "ArrowDown" ? 1 : -1) + options.length) %
              options.length,
      );
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      typeahead.current += e.key.toLowerCase();
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        typeahead.current = "";
      }, 700);
      const index = options.findIndex((o) =>
        o.label.toLowerCase().startsWith(typeahead.current),
      );
      if (index >= 0) {
        if (open) setActive(index);
        else choose(index);
      }
    }
  }
  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popup}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          dir={prefs.lang === "fa" ? "rtl" : "ltr"}
          className="select-popup"
          style={position}
          initial={animate ? { opacity: 0, y: -6, scale: 0.97 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: animate ? -4 : 0, scale: animate ? 0.98 : 1 }}
          transition={{ duration: animate ? 0.18 : 0, ease }}
        >
          {options.map((o, i) => (
            <div
              key={o.value}
              role="option"
              aria-selected={String(o.value) === String(value)}
              id={`${id}-${i}`}
              data-index={i}
              className={`select-option ${active === i ? "highlighted" : ""} ${String(o.value) === String(value) ? "chosen" : ""}`}
              onPointerMove={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              {o.icon && <span className="select-option-icon">{o.icon}</span>}
              <span>
                {o.label}
                {o.description && <small>{o.description}</small>}
              </span>
              {String(o.value) === String(value) && <Check size={15} />}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
  // A dialog's top layer sits above body portals. Mount its dropdown inside that dialog.
  const host = trigger.current?.closest("dialog") || document.body;
  return (
    <>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        disabled={disabled}
        onKeyDown={key}
        onClick={() => (open ? setOpen(false) : show())}
        className={`select-trigger ${open ? "is-open" : ""} ${compact ? "select-compact" : ""}`}
      >
        {selected?.icon && (
          <span className="select-value-icon">{selected.icon}</span>
        )}
        <span>{selected?.label}</span>
        <ChevronDown size={17} />
      </button>
      {createPortal(dropdown, host)}
    </>
  );
}
