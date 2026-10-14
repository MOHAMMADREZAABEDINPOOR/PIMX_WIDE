import React from "react";
import { Cpu, FileKey2, Link2, LockKeyhole, ShieldAlert } from "lucide-react";
import { Ambient } from "./motion";
import "./privacy-path.css";

export function PrivacyPathVisual({ path }: { path: number }) {
  return (
    <Ambient className={`privacy-path-art path-art-${path}`}>
      {path === 0 && (
        <div className="path-processor">
          <div className="processor-base" />
          <div className="processor-chip">
            <Cpu size={42} strokeWidth={1.3} />
            <span>LOCAL / AES</span>
            {Array.from({ length: 12 }, (_, i) => (
              <i
                key={i}
                style={{ "--pin": i % 3 } as React.CSSProperties}
                className={`processor-pin pin-side-${Math.floor(i / 3)}`}
              />
            ))}
          </div>
          <div className="processor-signal">
            <i />
            <i />
            <i />
          </div>
        </div>
      )}
      {path === 1 && (
        <div className="path-storage">
          <div className="storage-disk disk-top">
            <span>Encrypted</span>
          </div>
          <div className="storage-disk disk-middle">
            <i />
            <i />
            <i />
          </div>
          <div className="storage-disk disk-bottom">
            <i />
            <i />
            <i />
          </div>
          <div className="storage-key">
            <LockKeyhole size={22} />
          </div>
          <div className="storage-file">
            <FileKey2 size={24} />
          </div>
        </div>
      )}
      {path === 2 && (
        <div className="path-delivery">
          <div className="delivery-track">
            <i />
          </div>
          <div className="delivery-package package-source">
            <FileKey2 size={28} />
            <span>SEALED</span>
          </div>
          <div className="delivery-package package-destination">
            <LockKeyhole size={28} />
            <span>RECEIVED</span>
          </div>
          <div className="delivery-link">
            <Link2 size={23} />
          </div>
        </div>
      )}
      {path === 3 && (
        <div className="path-analytics">
          <div className="analytics-window">
            <div className="analytics-toolbar">
              <i />
              <i />
              <i />
              <span>OPT-IN</span>
            </div>
            <div className="analytics-bars">
              {[32, 54, 43, 72, 61].map((h, i) => (
                <i
                  key={i}
                  style={
                    {
                      "--bar-height": `${h}%`,
                      "--bar-delay": `${i * -0.4}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="analytics-axis" />
          </div>
          <div className="analytics-choice">
            <i />
            <span>YOUR CHOICE</span>
          </div>
        </div>
      )}
      {path === 4 && (
        <div className="path-limits">
          <div className="limits-boundary" />
          <div className="limits-shield">
            <ShieldAlert size={62} strokeWidth={1.1} />
          </div>
          <span className="limits-note">KNOW THE LIMITS</span>
          <i className="limit-point point-first" />
          <i className="limit-point point-second" />
        </div>
      )}
    </Ambient>
  );
}
