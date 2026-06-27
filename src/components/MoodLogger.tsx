import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { useLocalStorage, STORAGE_KEYS, type MoodEntry } from "@/lib/storage";

const MOODS: { emoji: string; label: string }[] = [
  { emoji: "😞", label: "Down" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😐", label: "Flat" },
  { emoji: "😊", label: "Okay" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🤩", label: "Bright" },
];

export function MoodLogger() {
  const [moods, setMoods] = useLocalStorage<MoodEntry[]>(STORAGE_KEYS.moods, []);
  const [selected, setSelected] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");

  const save = () => {
    if (selected === null) return;
    const m = MOODS[selected];
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      emoji: m.emoji,
      label: m.label,
      intensity,
      note: note.trim() || undefined,
    };
    setMoods([entry, ...moods].slice(0, 100));
    setSelected(null);
    setNote("");
    setIntensity(5);
    try {
      toast.success("Mood logged 💜");
    } catch {}
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">How are you, really?</h3>
        <p className="mt-1 text-xs text-muted-foreground/80">Tap an orb. No judgment.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {MOODS.map((m, i) => {
          const active = selected === i;
          return (
            <motion.button
              key={m.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(i)}
              className="group relative flex flex-col items-center gap-1 rounded-2xl p-3 transition-colors"
              style={{
                background: active
                  ? "radial-gradient(circle at 50% 30%, oklch(0.62 0.22 290 / 0.45), oklch(0.62 0.22 290 / 0.1) 60%, transparent 75%)"
                  : "transparent",
              }}
            >
              <span className={`text-3xl transition-all duration-300 ${active ? "drop-shadow-[0_0_18px_oklch(0.78_0.16_200/0.7)]" : "group-hover:scale-110"}`}>
                {m.emoji}
              </span>
              <span className="text-[10px] tracking-wide text-muted-foreground">{m.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Intensity</span>
          <span className="font-mono text-foreground">{intensity}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="mood-slider mt-2 w-full"
          style={{
            appearance: "none",
            height: 8,
            borderRadius: 999,
            background: `linear-gradient(90deg, oklch(0.62 0.22 290) 0%, oklch(0.78 0.16 200) ${intensity * 10}%, oklch(0.25 0.04 275) ${intensity * 10}%)`,
          }}
        />
        <style>{`
          .mood-slider::-webkit-slider-thumb { appearance: none; width: 22px; height: 22px; border-radius: 999px; background: white; box-shadow: 0 0 16px 2px oklch(0.78 0.16 200 / 0.8); cursor: pointer; border: 2px solid oklch(0.78 0.16 200); }
          .mood-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 999px; background: white; box-shadow: 0 0 16px 2px oklch(0.78 0.16 200 / 0.8); cursor: pointer; border: 2px solid oklch(0.78 0.16 200); }
        `}</style>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="One sentence about why? (optional)"
        rows={2}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <GlowButton size="sm" onClick={save} disabled={selected === null}>
        Log mood
      </GlowButton>

      {moods.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent</h4>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {moods.slice(0, 6).map((e) => (
              <GlassCard key={e.id} className="p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span>
                    <span className="mr-2 text-base">{e.emoji}</span>
                    <span className="font-medium">{e.label}</span>
                    <span className="ml-2 text-muted-foreground">·{e.intensity}/10</span>
                  </span>
                  <span className="text-muted-foreground">{new Date(e.ts).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                </div>
                {e.note && <p className="mt-1 text-muted-foreground">{e.note}</p>}
              </GlassCard>
            ))}
          </div>
          {moods.length >= 2 && <MoodSparkline moods={moods.slice(0, 14).reverse()} />}
          {moods.length >= 3 && <MoodInsights moods={moods} />}
        </div>
      )}
    </div>
  );
}

export function MoodSparkline({ moods }: { moods: { intensity: number; emoji: string; ts: number }[] }) {
  const max = 10;
  const w = 280;
  const h = 80;
  const plotHeight = h - 20;
  const pts = moods.map((m, i) => {
    const x = moods.length > 1 ? (i / (moods.length - 1)) * w : w / 2;
    const y = h - (m.intensity / max) * plotHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Mood trend</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-xl overflow-hidden" style={{ background: "oklch(0.15 0.04 275 / 0.5)" }}>
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.62 0.22 290)" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 200)" />
          </linearGradient>
        </defs>
        <polyline points={pts} fill="none" stroke="url(#mg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {moods.map((m, i) => {
          const x = moods.length > 1 ? (i / (moods.length - 1)) * w : w / 2;
          const pointY = h - (m.intensity / max) * plotHeight;
          const emojiY = pointY - 10;
          return (
            <g key={i}>
              <circle cx={x} cy={pointY} r={3} fill="oklch(0.78 0.16 200)" />
              <text x={x} y={emojiY} textAnchor="middle" fontSize="14" style={{ userSelect: "none" }}>
                {m.emoji}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MoodInsights({ moods }: { moods: MoodEntry[] }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get moods from this week
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekMoods = moods.filter((m) => m.ts > weekAgo);

  if (weekMoods.length < 3) return null;

  // Find most frequent mood
  const moodCounts: Record<string, number> = {};
  weekMoods.forEach((m) => {
    moodCounts[m.label] = (moodCounts[m.label] || 0) + 1;
  });
  const mostFrequent = Object.entries(moodCounts).sort(
    ([, a], [, b]) => b - a
  )[0];
  const mostFrequentMood = weekMoods.find(
    (m) => m.label === mostFrequent[0]
  );

  // Calculate average intensity
  const avgIntensity = Math.round(
    weekMoods.reduce((sum, m) => sum + m.intensity, 0) / weekMoods.length
  );

  // Generate insight on mount
  useEffect(() => {
    const generateInsight = async () => {
      setLoading(true);
      try {
        const moodyStr = weekMoods
          .slice(0, 5)
          .map((m) => `${m.emoji} ${m.label} (${m.intensity}/10)`)
          .join(", ");
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ preset: "mood-insight", moodSummary: moodyStr }),
        });
        if (!res.ok || !res.body) throw new Error("AI error");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
        }
        setInsight(acc.trim());
      } catch (e) {
        setInsight(null);
      } finally {
        setLoading(false);
      }
    };
    generateInsight();
  }, []);

  return (
    <div className="mt-4 rounded-xl glass px-4 py-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Your week
      </h4>
      <div className="space-y-2 text-xs">
        {mostFrequentMood && (
          <p>
            <span className="text-sm">{mostFrequentMood.emoji}</span> Most:{" "}
            <span className="font-medium">{mostFrequentMood.label}</span>
          </p>
        )}
        <p>
          Average intensity:{" "}
          <span className="font-medium">{avgIntensity}/10</span>
        </p>
        {insight && (
          <p className="text-muted-foreground italic">{loading ? "..." : insight}</p>
        )}
      </div>
    </div>
  );
}
