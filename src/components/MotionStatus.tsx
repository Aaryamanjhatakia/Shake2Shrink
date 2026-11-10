import type { useMotion } from "../hooks/useMotion";
export function MotionStatus({
  motion,
}: {
  motion: ReturnType<typeof useMotion>;
}) {
  return (
    <section className="motion" aria-label="Motion control">
      <p id="motionMessage" role="status">
        {motion.status.message}
      </p>
      <button
        id="enable"
        disabled={motion.pending}
        onClick={motion.toggle}
        className={motion.enabled ? "quietButton" : "accentButton"}
      >
        {motion.pending
          ? "Requesting…"
          : motion.enabled
            ? "Pause motion"
            : "Enable motion"}
      </button>
    </section>
  );
}
