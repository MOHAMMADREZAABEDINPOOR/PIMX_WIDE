import React, { useEffect, useRef, useState } from "react";
import { Download, ArrowUpRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { download } from "../services/download";
import { PageHeading } from "../components/ui";
export function ReceivePage({
  usePayload,
}: {
  usePayload: (p: string) => void;
}) {
  const { l } = usePreferences(),
    [id, setId] = useState(""),
    [payload, setPayload] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const alive = useRef(true);
  useEffect(() => {
    setId(location.hash.slice(1));
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  async function receive() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/shares/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const d = (await r.json()) as { payload: string };
      if (!r.ok) throw new Error();
      if (alive.current) {
        setPayload(d.payload);
        history.replaceState(null, "", "/share");
      }
    } catch {
      if (alive.current)
        setError(
          l(
            "لینک منقضی شده، دریافت‌های آن تمام شده یا سرویس در دسترس نیست.",
            "This link has expired, reached its download limit, or the service is unavailable.",
          ),
        );
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <div className="workspace wrap">
      <PageHeading
        eyebrow={l("دریافت بسته رمز‌شده", "Receive an encrypted package")}
        title={l("یک بسته خصوصی برای شما.", "A private package for you.")}
        text={l(
          "دریافت فقط با انتخاب شما انجام می‌شود؛ پیش‌نمایش لینک آن را مصرف نمی‌کند.",
          "Retrieval happens only when you choose. Link previews do not consume a download.",
        )}
      />
      <div className="panel receive-card">
        <span className="tool-icon">
          <LockKeyhole size={28} />
        </span>
        <h2>
          {payload
            ? l("بسته دریافت شد.", "Package received.")
            : l("آماده دریافت هستید؟", "Ready to receive?")}
        </h2>
        <p className="muted">
          {l(
            "برای رمزگشایی، رمز عبور را از فرستنده جداگانه بگیرید. هر دریافت موفق از سهمیه لینک کم می‌شود.",
            "Get the password separately from the sender. Each successful retrieval uses one download.",
          )}
        </p>
        {error && (
          <p className="error-note" role="alert">
            {error}
          </p>
        )}
        {payload ? (
          <div className="button-grid">
            <button
              className="btn secondary"
              onClick={() => download(payload, "pimx-shared.pimx")}
            >
              <Download size={17} />
              {l("دانلود بسته", "Download package")}
            </button>
            <button className="btn primary" onClick={() => usePayload(payload)}>
              {l("بازکردن در استودیو", "Open in studio")}
              <ArrowUpRight size={17} />
            </button>
          </div>
        ) : (
          <button
            className="btn primary full"
            disabled={busy || !/^[a-f0-9]{48}$/.test(id)}
            onClick={receive}
          >
            <Download size={17} />
            {busy
              ? l("در حال دریافت…", "Retrieving…")
              : l("دریافت بسته رمز‌شده", "Retrieve encrypted package")}
          </button>
        )}
        <div className="subtle-note">
          <ShieldCheck size={17} />
          {l(
            "رمز عبور شما به سرور ارسال نمی‌شود.",
            "Your password is never sent to the server.",
          )}
        </div>
      </div>
    </div>
  );
}
