import { StrictMode } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { App } from "./App";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function mount() {
  return render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }));
}
function sample(x: number) {
  const event = new Event("devicemotion");
  Object.defineProperties(event, {
    acceleration: { value: { x, y: 0, z: 0 } },
    accelerationIncludingGravity: { value: null },
  });
  act(() => {
    window.dispatchEvent(event);
  });
}
async function enable(permission = "granted") {
  vi.stubGlobal("isSecureContext", true);
  vi.stubGlobal("DeviceMotionEvent", {
    requestPermission: vi.fn().mockResolvedValue(permission),
  });
  await act(async () => {
    click("Enable motion");
  });
}

describe("keyboard migration", () => {
  it("keeps one sensor listener across settings changes and preserves notes in the modal", async () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const view = mount();
    click("a");
    await enable();
    const listenerCount = () =>
      add.mock.calls.filter(([name]) => name === "devicemotion").length;
    expect(listenerCount()).toBe(1);
    click("Open settings");
    fireEvent.change(
      screen.getByRole("slider", { name: /Shake sensitivity/ }),
      { target: { value: "18" } },
    );
    fireEvent.keyDown(document.body, { key: "z" });
    expect(document.getElementById("text")?.textContent).toBe("a");
    expect(listenerCount()).toBe(1);
    click("Close settings");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Open settings" }),
    );
    view.unmount();
    expect(
      remove.mock.calls.filter(([name]) => name === "devicemotion"),
    ).toHaveLength(1);
  });
  it("preserves typing, shift, numeric keys, deletion, layout changes, and clearing", () => {
    mount();
    click("h");
    click("shift");
    click("i");
    click("space");
    click("123");
    click("1");
    click("backspace");
    click("enter");
    click("ABC");
    expect(screen.getByRole("textbox").textContent).toBe("hI \n");
    click("Manual layout toggle");
    click("Open settings");
    click("← Left hand");
    fireEvent.change(screen.getByRole("slider", { name: /Compact width/ }), {
      target: { value: "70" },
    });
    expect(document.getElementById("keyboard")?.style.width).toBe("70%");
    expect(document.getElementById("keyboard")?.style.marginRight).toBe("auto");
    click("Close settings");
    click("Restore full width");
    expect(screen.getByRole("textbox").textContent).toBe("hI \n");
    expect(document.getElementById("keyboard")?.style.width).toBe("100%");
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "x" });
    expect(screen.getByRole("textbox").textContent).toBe("hI \nx");
    click("Open settings");
    fireEvent.keyDown(screen.getByRole("slider", { name: /Compact width/ }), {
      key: "z",
    });
    expect(screen.getByRole("textbox").textContent).toBe("hI \nx");
    click("Close settings");
    click("Clear");
    expect(screen.getByText("0 characters")).toBeTruthy();
  });

  it("keeps motion opt-in and handles denied, unsupported, and insecure access", async () => {
    mount();
    await enable("denied");
    expect(screen.getByText(/Motion permission was not granted/)).toBeTruthy();
    vi.stubGlobal("DeviceMotionEvent", undefined);
    await act(async () => {
      click("Enable motion");
    });
    expect(screen.getByText(/Motion is unavailable here/)).toBeTruthy();
    vi.stubGlobal("isSecureContext", false);
    await act(async () => {
      click("Enable motion");
    });
    expect(screen.getByText(/Motion needs HTTPS/)).toBeTruthy();
  });

  it("handles no-data, synthetic shakes, cooldown, pause, and effect cleanup", async () => {
    vi.useFakeTimers();
    let now = 100;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const view = mount();
    await enable();
    expect(screen.getAllByText("Waiting for sensor")[0]).toBeTruthy();
    now = 4200;
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getAllByText("No sensor data yet")[0]).toBeTruthy();
    sample(20);
    now = 4250;
    sample(0);
    now = 4400;
    sample(20);
    expect(screen.getByText(/One-handed .*right/)).toBeTruthy();
    click("Open settings");
    expect(screen.getByText(/Gesture switches: 1/)).toBeTruthy();
    now = 4500;
    sample(0);
    now = 4600;
    sample(20);
    expect(screen.getByText(/Gesture switches: 1/)).toBeTruthy();
    now = 5900;
    sample(0);
    now = 6000;
    sample(20);
    now = 6100;
    sample(0);
    now = 6200;
    sample(20);
    expect(screen.getByText("Full-width mode")).toBeTruthy();
    expect(screen.getByText(/Gesture switches: 2/)).toBeTruthy();
    click("Close settings");
    click("Pause motion");
    sample(20);
    expect(screen.getAllByText("Motion is off")[0]).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(1800);
    });
    expect(vi.getTimerCount()).toBe(0);
    await enable();
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
    sample(20);
  });
});
