import type { Hand } from "../types";

interface Props {
  numeric: boolean;
  shift: boolean;
  compact: boolean;
  width: number;
  hand: Hand;
  enabled: boolean;
  onPress: (key: string) => void;
  onToggle: () => void;
}
const alphabetRows = [
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  ["shift", ..."zxcvbnm", "backspace"],
  ["123", ",", "space", ".", "enter"],
];
const numberRows = [
  "1234567890".split(""),
  ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
  ["shift", ".", ",", "?", "!", "'", "backspace"],
  ["ABC", "space", "enter"],
];
const labels: Record<string, string> = {
  shift: "⇧",
  backspace: "⌫",
  space: "space",
  enter: "return",
};

export function Keyboard({
  numeric,
  shift,
  compact,
  width,
  hand,
  enabled,
  onPress,
  onToggle,
}: Props) {
  return (
    <div className="keyboardArea" data-hand={hand} data-compact={compact}>
      <div className="keyboardTop">
        <span id="layoutLabel">
          {compact ? `One-handed · ${hand}` : "Full width"}
        </span>
        <button
          id="toggle"
          onClick={onToggle}
          aria-label="Manual layout toggle"
        >
          {compact ? "Full width" : "One-handed"} <span>· manual</span>
        </button>
      </div>
      <div className="keyboardDock">
        {compact && (
          <div className="restoreSpace" style={{ width: `${100 - width}%` }}>
            <button
              className="restoreButton"
              aria-label="Restore full width"
              onClick={onToggle}
            >
              <span aria-hidden="true">{hand === "right" ? "→" : "←"}</span>
            </button>
          </div>
        )}
        <div
          id="keyboard"
          style={{
            width: compact ? `${width}%` : "100%",
            marginLeft: hand === "right" ? "auto" : "0",
            marginRight: hand === "left" ? "auto" : "0",
          }}
        >
          {(numeric ? numberRows : alphabetRows).map((row, index) => (
            <div className="row" key={index}>
              {row.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={[
                    "key",
                    ["shift", "backspace", "123", "ABC", "enter"].includes(
                      key,
                    ) && "special",
                    key === "space" && "space",
                    key === "shift" && shift && "active",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label={key}
                  aria-pressed={key === "shift" ? shift : undefined}
                  onClick={() => onPress(key)}
                >
                  {labels[key] || (shift ? key.toUpperCase() : key)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="keyboardHint" id="hint">
        {enabled
          ? `Shake to ${compact ? "restore full width" : "shrink the keyboard"}`
          : "Enable motion to shake and shrink"}
      </div>
    </div>
  );
}
