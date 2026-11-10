import { describe, expect, it } from "vitest";
import { ShakeDetector } from "./shakeDetector";

describe("shake detector", () => {
  it("rejects invalid data and removes constant gravity", () => {
    const detector = new ShakeDetector();
    expect(detector.sample(null, null, 100, 13)).toBeNull();
    expect(detector.sample({ x: NaN, y: 0, z: 0 }, null, 100, 13)).toBeNull();
    const gravity = { x: 0, y: 0, z: 9.8 };
    expect(detector.sample(null, gravity, 100, 13)).toBeNull();
    expect(detector.sample(null, gravity, 200, 13)?.magnitude).toBeCloseTo(0);
  });
  it("requires separated peaks and resets on background/resume", () => {
    const detector = new ShakeDetector();
    const sample = (x: number, time: number) =>
      detector.sample({ x, y: 0, z: 0 }, null, time, 13)?.triggered;
    expect(sample(20, 100)).toBe(false);
    expect(sample(20, 250)).toBe(false);
    sample(0, 300);
    detector.reset(900);
    expect(sample(20, 500)).toBe(false);
    expect(sample(20, 1000)).toBe(false);
    sample(0, 1100);
    expect(sample(20, 1200)).toBe(true);
  });
});
