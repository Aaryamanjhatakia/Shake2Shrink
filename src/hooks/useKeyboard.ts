import { useEffect, useReducer } from "react";

interface KeyboardState {
  value: string;
  shift: boolean;
  numeric: boolean;
}
type Action =
  | { type: "key"; key: string }
  | { type: "physical"; key: string }
  | { type: "clear" };

function reducer(state: KeyboardState, action: Action): KeyboardState {
  if (action.type === "clear") return { ...state, value: "" };
  if (action.type === "physical")
    return { ...state, value: state.value + action.key };
  const key = action.key;
  if (key === "shift") return { ...state, shift: !state.shift };
  if (key === "123" || key === "ABC")
    return { ...state, numeric: !state.numeric };
  if (key === "backspace")
    return { ...state, value: Array.from(state.value).slice(0, -1).join("") };
  if (key === "space" || key === "enter")
    return { ...state, value: state.value + (key === "space" ? " " : "\n") };
  return {
    ...state,
    value: state.value + (state.shift ? key.toUpperCase() : key),
    shift: false,
  };
}

export function useKeyboard(paused = false) {
  const [state, dispatch] = useReducer(reducer, {
    value: "",
    shift: false,
    numeric: false,
  });
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        paused ||
        (event.target instanceof Element &&
          event.target.matches("input,button,summary")) ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;
      if (event.key === "Backspace" || event.key === "Enter") {
        event.preventDefault();
        dispatch({
          type: "key",
          key: event.key === "Backspace" ? "backspace" : "enter",
        });
      } else if (event.key.length === 1) {
        event.preventDefault();
        dispatch({ type: "physical", key: event.key });
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [paused]);
  return {
    ...state,
    press: (key: string) => dispatch({ type: "key", key }),
    clear: () => dispatch({ type: "clear" }),
  };
}
