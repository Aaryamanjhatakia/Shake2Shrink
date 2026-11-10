type Vector = { x: number; y: number; z: number };
type Reading = { x: number | null; y: number | null; z: number | null } | null;

function valid(reading: Reading): reading is Vector {
  return !!reading && [reading.x, reading.y, reading.z].every(Number.isFinite);
}

// Two separated peaks trigger a switch; a low reading rearms peak detection.
// Keep these timings identical to the original phone-tested prototype.
export class ShakeDetector {
  private gravity: Vector | null = null;
  private peakAt = 0;
  private lastPeak = 0;
  private cooldown = 0;

  reset(cooldown = 0) {
    this.gravity = null;
    this.peakAt = 0;
    this.lastPeak = 0;
    this.cooldown = cooldown;
  }

  resetPeak() {
    this.peakAt = 0;
  }

  sample(
    acceleration: Reading,
    includingGravity: Reading,
    now: number,
    threshold: number,
  ) {
    let reading = acceleration;
    if (!valid(reading)) {
      if (!valid(includingGravity)) return null;
      if (!this.gravity) {
        this.gravity = { ...includingGravity };
        return null;
      }
      const filtered = { x: 0, y: 0, z: 0 };
      for (const axis of ["x", "y", "z"] as const) {
        this.gravity[axis] =
          0.8 * this.gravity[axis] + 0.2 * includingGravity[axis];
        filtered[axis] = includingGravity[axis] - this.gravity[axis];
      }
      reading = filtered;
    }
    if (!valid(reading)) return null;
    const magnitude = Math.hypot(reading.x, reading.y, reading.z);
    let triggered = false;
    if (now >= this.cooldown) {
      if (magnitude < threshold * 0.55) this.lastPeak = 0;
      else if (magnitude > threshold && !this.lastPeak) {
        this.lastPeak = now;
        if (this.peakAt && now - this.peakAt > 80 && now - this.peakAt < 750) {
          triggered = true;
          this.cooldown = now + 1400;
          this.peakAt = 0;
        } else this.peakAt = now;
      }
    }
    return { magnitude, triggered };
  }
}
