import { useEffect, useRef } from "react";
import type { useMotion } from "../hooks/useMotion";
import type { Hand } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  motion: ReturnType<typeof useMotion>;
  hand: Hand;
  width: number;
  sensitivity: number;
  onHandChange: (hand: Hand) => void;
  onWidthChange: (width: number) => void;
  onSensitivityChange: (sensitivity: number) => void;
}
export function Settings({
  open,
  onClose,
  motion,
  hand,
  width,
  sensitivity,
  onHandChange,
  onWidthChange,
  onSensitivityChange,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    if (open && !panel.open) panel.showModal();
    if (!open && panel.open) panel.close();
    return () => {
      if (panel.open) panel.close();
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="settings"
      aria-labelledby="settingsTitle"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "button:not(:disabled), input:not(:disabled), [tabindex='0']",
          ),
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="settingsHeading">
        <h2 id="settingsTitle">Settings</h2>
        <button autoFocus aria-label="Close settings" onClick={onClose}>
          Close
        </button>
      </div>
      <label id="handLabel">Holding hand</label>
      <div className="seg" role="group" aria-labelledby="handLabel">
        <button
          id="left"
          aria-pressed={hand === "left"}
          onClick={() => onHandChange("left")}
        >
          ← Left hand
        </button>
        <button
          id="right"
          aria-pressed={hand === "right"}
          onClick={() => onHandChange("right")}
        >
          Right hand →
        </button>
      </div>
      <label htmlFor="width">
        Compact width <output id="widthValue">{width}%</output>
      </label>
      <input
        id="width"
        type="range"
        min="65"
        max="90"
        value={width}
        onChange={(event) => onWidthChange(Number(event.target.value))}
      />
      <label htmlFor="sensitivity">
        Shake sensitivity{" "}
        <output id="sensitivityValue">
          {sensitivity < 10 ? "Gentle" : sensitivity > 16 ? "Firm" : "Balanced"}
        </output>
      </label>
      <input
        id="sensitivity"
        type="range"
        min="6"
        max="20"
        value={sensitivity}
        onChange={(event) => onSensitivityChange(Number(event.target.value))}
      />
      <div className="rangeLabels">
        <span>Gentle shake</span>
        <span>Stronger shake</span>
      </div>
      <p className="note">
        Hand alignment is selected manually in this prototype. Typed text stays
        on this page.
      </p>
      <section className="diagnostics" aria-label="Motion diagnostics">
        <h3>Motion diagnostics</h3>
        <p>{motion.status.title}</p>
        <p id="diagnostics">
          Sensor samples: {motion.samples} · Gesture switches: {motion.switches}
        </p>
        <div className="meter" aria-hidden="true">
          <div style={{ width: `${motion.meter}%` }} />
        </div>
        <p>
          Manual switching checks the layout only. Test shakes on your phone
          over HTTPS.
        </p>
      </section>
    </dialog>
  );
}
