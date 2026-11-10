import { useEffect, useRef } from "react";

export function TypingArea({
  value,
  onClear,
}: {
  value: string;
  onClear: () => void;
}) {
  const text = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (text.current) text.current.scrollTop = text.current.scrollHeight;
  }, [value]);
  return (
    <section className="notes" aria-label="Note">
      <div className="noteToolbar">
        <span>YOUR NOTE</span>
        <button id="clear" onClick={onClear}>
          Clear
        </button>
      </div>
      <div
        ref={text}
        id="text"
        role="textbox"
        aria-label="Typed text; use the custom keyboard below"
        aria-readonly="true"
        aria-multiline="true"
        tabIndex={0}
      >
        {value || <span className="placeholder">Start typing…</span>}
      </div>
      <div className="textMeta">
        <span id="count">{Array.from(value).length} characters</span>
        <span>Just this session</span>
      </div>
    </section>
  );
}
