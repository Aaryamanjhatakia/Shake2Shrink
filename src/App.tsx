import { useEffect, useRef, useState } from "react";
import { Keyboard } from "./components/Keyboard";
import { Settings } from "./components/Settings";
import { TypingArea } from "./components/TypingArea";
import { MotionStatus } from "./components/MotionStatus";
import { useKeyboard } from "./hooks/useKeyboard";
import { useMotion } from "./hooks/useMotion";
import type { Hand } from "./types";

export function App() {
  const [compact, setCompact] = useState(false);
  const [hand, setHand] = useState<Hand>("right");
  const [width, setWidth] = useState(78);
  const [sensitivity, setSensitivity] = useState(13);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const settingsButton = useRef<HTMLButtonElement>(null);
  const keyboard = useKeyboard(settingsOpen);
  const toggleLayout = () => setCompact((value) => !value);
  const motion = useMotion(sensitivity, toggleLayout);
  const previousMode = useRef(compact);
  useEffect(() => {
    if (previousMode.current === compact) return;
    previousMode.current = compact;
    setFeedback(compact ? "One-handed mode" : "Full-width mode");
    const timer = window.setTimeout(() => setFeedback(""), 1800);
    return () => window.clearTimeout(timer);
  }, [compact]);

  return (
    <main className="workspace">
      <header className="appHeader">
        <h1>
          Shake<span>2</span>Shrink
        </h1>
        <span className="motionBadge" title={motion.status.message}>
          <span
            className={motion.connected ? "statusDot connected" : "statusDot"}
          />
          {motion.status.title}
        </span>
        <button
          ref={settingsButton}
          className="settingsButton"
          aria-label="Open settings"
          aria-haspopup="dialog"
          aria-expanded={settingsOpen}
          onClick={() => setSettingsOpen(true)}
        >
          Settings
        </button>
      </header>
      <TypingArea value={keyboard.value} onClear={keyboard.clear} />
      <MotionStatus motion={motion} />
      <div className="modeFeedback" role="status" aria-live="polite">
        {feedback}
      </div>
      <Keyboard
        numeric={keyboard.numeric}
        shift={keyboard.shift}
        compact={compact}
        width={width}
        hand={hand}
        enabled={motion.enabled}
        onPress={keyboard.press}
        onToggle={toggleLayout}
      />
      <Settings
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          settingsButton.current?.focus();
        }}
        hand={hand}
        width={width}
        sensitivity={sensitivity}
        onHandChange={setHand}
        onWidthChange={setWidth}
        onSensitivityChange={setSensitivity}
        motion={motion}
      />
    </main>
  );
}
