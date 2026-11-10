import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ShakeDetector } from "../motion/shakeDetector";

type PermissionMotion = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<string>;
};
const initialStatus = {
  title: "Motion is off",
  message: "On your phone, enable motion to try the gesture.",
};

export function useMotion(threshold: number, onShake: () => void) {
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [meter, setMeter] = useState(0);
  const [connected, setConnected] = useState(false);
  const [samples, setSamples] = useState(0);
  const [switches, setSwitches] = useState(0);
  const detector = useRef(new ShakeDetector());
  const lastSample = useRef(0);
  const sampleCount = useRef(0);
  const mounted = useRef(false);
  const requesting = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    detector.current.resetPeak();
  }, [threshold]);

  const handleMotion = useEffectEvent((event: DeviceMotionEvent) => {
    if (document.hidden) return;
    const now = performance.now();
    const result = detector.current.sample(
      event.acceleration,
      event.accelerationIncludingGravity,
      now,
      threshold,
    );
    if (!result) return;
    lastSample.current = now;
    sampleCount.current++;
    setMeter(Math.min(100, (result.magnitude / 25) * 100));
    setConnected(true);
    setStatus({
      title: "Motion is active",
      message: "Sensor connected. Give your phone a short, gentle shake.",
    });
    if (
      sampleCount.current === 1 ||
      sampleCount.current % 10 === 0 ||
      result.triggered
    )
      setSamples(sampleCount.current);
    if (result.triggered) {
      setSwitches((count) => count + 1);
      onShake();
    }
  });

  useEffect(() => {
    function onVisibilityChange() {
      detector.current.reset(performance.now() + 500);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: DeviceMotionEvent) => handleMotion(event);
    window.addEventListener("devicemotion", listener);
    const timer = window.setInterval(() => {
      if (!document.hidden && performance.now() - lastSample.current > 3500) {
        setConnected(false);
        setStatus({
          title: "No sensor data yet",
          message:
            "Open directly in Safari on your phone and check motion permissions.",
        });
      }
    }, 2000);
    return () => {
      window.removeEventListener("devicemotion", listener);
      window.clearInterval(timer);
    };
  }, [enabled]);

  async function toggle() {
    if (requesting.current) return;
    if (enabled) {
      setEnabled(false);
      setConnected(false);
      setMeter(0);
      setStatus({
        title: "Motion is off",
        message: "Motion paused. Manual layout controls still work.",
      });
      return;
    }
    requesting.current = true;
    setPending(true);
    try {
      if (!window.isSecureContext)
        throw new Error(
          "Motion needs HTTPS. Open the published link directly in Safari.",
        );
      if (typeof DeviceMotionEvent === "undefined")
        throw new Error(
          "Motion is unavailable here. Open this page on your phone.",
        );
      const motion = DeviceMotionEvent as PermissionMotion;
      if (
        motion.requestPermission &&
        (await motion.requestPermission()) !== "granted"
      )
        throw new Error(
          "Motion permission was not granted. Allow motion access in Safari, then retry.",
        );
      if (!mounted.current) return;
      detector.current.reset();
      lastSample.current = performance.now();
      setEnabled(true);
      setStatus({
        title: "Waiting for sensor",
        message: "Move your phone gently to check the connection.",
      });
    } catch (error) {
      if (mounted.current)
        setStatus({
          title: "Motion unavailable",
          message:
            error instanceof Error ? error.message : "Could not enable motion.",
        });
    } finally {
      requesting.current = false;
      if (mounted.current) setPending(false);
    }
  }
  return {
    enabled,
    pending,
    status,
    meter,
    connected,
    samples,
    switches,
    toggle,
  };
}
