import { motion, type Variants } from "motion/react";

interface VoiceOrbProps {
  state: "idle" | "listening" | "speaking";
  voiceName: string;
  onStop: () => void;
}

export function VoiceOrb({ state, voiceName, onStop }: VoiceOrbProps) {
  const ringVariants: Variants = {
    speaking: {
      scale: [0.8, 1.3],
      opacity: [0.45, 0],
      transition: { duration: 1.4, repeat: Infinity, ease: "easeOut" },
    },
  };

  const glowColors = {
    idle: "bg-gradient-to-br from-violet-500/40 via-slate-900 to-cyan-400/30",
    listening: "bg-gradient-to-br from-cyan-400/70 via-cyan-300/40 to-cyan-500/30",
    speaking: "bg-gradient-to-br from-violet-500/70 via-fuchsia-500/40 to-cyan-400/40",
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full shadow-[0_0_60px_-20px_rgba(138,92,255,0.55)]">
        <div className={`absolute inset-0 rounded-full ${glowColors[state]} blur-xl`} />
        {state === "speaking" && (
          <>
            {[0, 0.3, 0.6].map((delay) => (
              <motion.span
                key={delay}
                className="absolute inset-0 rounded-full border border-white/10"
                variants={ringVariants}
                initial={{ scale: 0.8, opacity: 0.45 }}
                animate={state === "speaking" ? "speaking" : "idle"}
                transition={{ duration: 1.4, repeat: Infinity, delay }}
              />
            ))}
          </>
        )}
        <motion.div
          animate={
            state === "idle"
              ? { scale: [1, 1.05, 1] }
              : state === "listening"
              ? { scale: [1, 1.08, 1] }
              : { scale: [1, 1.12, 1] }
          }
          transition={{ duration: state === "idle" ? 2.4 : 1.4, repeat: Infinity, ease: "easeInOut" }}
          className={`relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 ${
            state === "listening"
              ? "bg-cyan-400/15 shadow-[0_0_40px_-10px_rgba(56,189,248,0.45)]"
              : state === "speaking"
              ? "bg-violet-500/15 shadow-[0_0_40px_-10px_rgba(167,139,250,0.45)]"
              : "bg-white/5 shadow-[0_0_30px_-10px_rgba(148,163,184,0.35)]"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white shadow-[inset_0_0_16px_rgba(255,255,255,0.12)]">
            {state === "listening" ? "🎙️" : state === "speaking" ? "🔊" : "✨"}
          </div>
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{voiceName}</p>
        <p className="mt-1 text-xs text-muted-foreground">{state === "listening" ? "Listening…" : state === "speaking" ? "Speaking…" : "Idle voice mode"}</p>
      </div>
      <button
        type="button"
        onClick={onStop}
        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/10"
      >
        Stop
      </button>
    </div>
  );
}
