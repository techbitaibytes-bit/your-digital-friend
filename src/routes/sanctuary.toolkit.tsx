import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { Wind, Hand, Heart, Sparkles, Moon, Music, Clipboard, Clock, Users } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sanctuary/toolkit")({
  head: () => ({ meta: [{ title: "Healing Toolkit — EmpathAI" }] }),
  component: ToolkitPage,
});

type ToolId = "breath" | "ground" | "gratitude" | "affirm" | "bodyscan" | "sound" | "task" | "bodyDouble" | "timer";

const TOOLS: { id: ToolId; title: string; blurb: string; icon: typeof Wind }[] = [
  { id: "breath", title: "Box Breathing", blurb: "4-4-4-4. Slow your nervous system.", icon: Wind },
  { id: "ground", title: "5-4-3-2-1", blurb: "Anchor yourself in the room.", icon: Hand },
  { id: "gratitude", title: "Gratitude", blurb: "Three small things, right now.", icon: Heart },
  { id: "affirm", title: "Affirmations", blurb: "Words to soften the day.", icon: Sparkles },
  { id: "bodyscan", title: "Body Scan", blurb: "Tour your body, head to toe.", icon: Moon },
  { id: "sound", title: "Soundscape", blurb: "Gentle audio cues.", icon: Music },
  { id: "task", title: "Task Breakdown", blurb: "Turn one task into tiny micro-steps.", icon: Clipboard },
  { id: "bodyDouble", title: "Body Doubling", blurb: "I’m here while you work.", icon: Users },
  { id: "timer", title: "Transition Timer", blurb: "5-minute change with a gentle message.", icon: Clock },
];

function ToolkitPage() {
  const [active, setActive] = useState<ToolId | null>(null);
  const [hovered, setHovered] = useState<ToolId | null>(null);

  return (
    <>
      <AnimatedBackground />
      <TopBar />
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4 px-4 lg:px-6 py-4 pb-28 md:pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight px-1">Healing Toolkit</h1>
          <p className="mt-1 text-sm text-muted-foreground px-1">Pick a gentle tool for the moment you’re in. Small steps count.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TOOLS.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.id;
              return (
                <motion.button
                  key={t.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActive(t.id)}
                  onMouseEnter={() => setHovered(t.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="text-left"
                  style={{ boxShadow: hovered === t.id ? "var(--shadow-glow-accent)" : undefined }}
                >
                  <GlassCard
                    glow={isActive ? "primary" : "none"}
                    className={cn("p-5 transition-all", isActive && "border-primary/40", isActive && "shimmer-border")}
                  >
                    <div className={cn("mb-3 grid h-10 w-10 place-items-center rounded-xl glass-strong", isActive && "glow-accent")}>
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-semibold tracking-tight">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                  </GlassCard>
                </motion.button>
              );
            })}
          </div>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <GlassCard strong className="p-6 min-h-[24rem]">
            <AnimatePresence mode="wait">
              {active === null && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid place-items-center text-center text-sm text-muted-foreground">
                  Pick a tool to begin.
                </motion.div>
              )}
              {active === "breath" && <ToolWrapper key="b"><BoxBreath /></ToolWrapper>}
              {active === "ground" && <ToolWrapper key="g"><Grounding /></ToolWrapper>}
              {active === "gratitude" && <ToolWrapper key="gr"><Gratitude /></ToolWrapper>}
              {active === "affirm" && <ToolWrapper key="a"><Affirmations /></ToolWrapper>}
              {active === "bodyscan" && <ToolWrapper key="bs"><BodyScan /></ToolWrapper>}
              {active === "sound" && <ToolWrapper key="s"><Soundscape /></ToolWrapper>}
              {active === "task" && <ToolWrapper key="t"><TaskBreakdown /></ToolWrapper>}
              {active === "bodyDouble" && <ToolWrapper key="bd"><BodyDoubling /></ToolWrapper>}
              {active === "timer" && <ToolWrapper key="tt"><TransitionTimer /></ToolWrapper>}
            </AnimatePresence>
          </GlassCard>
        </aside>
      </div>
    </>
  );
}


function ToolWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

function BoxBreath() {
  const [running, setRunning] = useState(false);
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-lg font-semibold tracking-tight">Box Breathing</h3>
      <p className="text-sm text-muted-foreground mt-1">Inhale 4 · Hold 4 · Exhale 4 · Hold 4</p>
      <div className="relative my-8 grid place-items-center">
        <motion.div
          className="h-44 w-44 rounded-full"
          style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.62 0.22 290 / 0.6), oklch(0.78 0.16 200 / 0.2) 70%, transparent)", boxShadow: "var(--shadow-glow-primary)" }}
          animate={running ? { scale: [1, 1.35, 1.35, 1, 1] } : { scale: 1 }}
          transition={running ? { duration: 16, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] } : {}}
        />
        <motion.span
          className="absolute text-sm font-medium tracking-wide uppercase"
          animate={{ opacity: 1 }}
        >
          breathe
        </motion.span>
      </div>
      <div className="flex gap-2">
        <GlowButton size="sm" onClick={() => setRunning(true)} disabled={running}>Begin</GlowButton>
        <GlowButton size="sm" variant="ghost" onClick={() => setRunning(false)} disabled={!running}>Stop</GlowButton>
      </div>
      <p className="text-xs text-muted-foreground mt-3">Follow the orb. Five rounds is plenty.</p>
    </div>
  );
}

function Grounding() {
  const STEPS = [
    { n: 5, sense: "see" },
    { n: 4, sense: "feel" },
    { n: 3, sense: "hear" },
    { n: 2, sense: "smell" },
    { n: 1, sense: "taste" },
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">5-4-3-2-1 Grounding</h3>
      <p className="text-sm text-muted-foreground mt-1">Name them softly to yourself.</p>
      <ol className="mt-5 flex flex-col gap-2">
        {STEPS.map((s) => (
          <li key={s.n} className="flex items-center gap-3 rounded-xl glass px-3 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg font-mono text-sm bg-accent/15 text-accent border border-accent/30">{s.n}</span>
            <span className="text-sm">things you can <span className="font-semibold capitalize gradient-text">{s.sense}</span></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Gratitude() {
  const [items, setItems] = useLocalStorage<{ id: string; text: string; ts: number }[]>(STORAGE_KEYS.gratitude, []);
  const [text, setText] = useState("");
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">Gratitude</h3>
      <p className="text-sm text-muted-foreground mt-1">Tiny things count most.</p>
      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              setItems([{ id: crypto.randomUUID(), text: text.trim(), ts: Date.now() }, ...items].slice(0, 50));
              setText("");
            }
          }}
          placeholder="The warmth of my mug…"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <GlowButton size="sm" disabled={!text.trim()} onClick={() => { setItems([{ id: crypto.randomUUID(), text: text.trim(), ts: Date.now() }, ...items].slice(0, 50)); setText(""); }}>Add</GlowButton>
      </div>
      <div className="mt-4 flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {items.map((g) => (
          <div key={g.id} className="rounded-xl glass px-3 py-2 text-sm">{g.text}</div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground/70">Nothing yet. Even one thing helps.</p>}
      </div>
    </div>
  );
}

function Affirmations() {
  const LINES = [
    "I'm allowed to take up space.",
    "This feeling is information, not a verdict.",
    "I can do hard things, slowly.",
    "My nervous system is doing its best.",
    "I'm worthy of softness today.",
    "I don't have to earn rest.",
    "I can be a beginner again.",
    "I'm safe in this moment.",
  ];
  const [i, setI] = useState(0);
  const [generated, setGenerated] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setGenerated(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ preset: "affirmations" }),
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
      const lines = acc.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 3);
      if (lines.length) setGenerated(lines);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold tracking-tight">Affirmations</h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={generated ? generated.join("|") : LINES[i]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="my-8 text-xl sm:text-2xl font-medium tracking-tight gradient-text"
        >
          "{(generated ? generated[i % generated.length] : LINES[i])}"
        </motion.p>
      </AnimatePresence>
      <div className="flex items-center justify-center gap-2">
        <GlowButton size="sm" onClick={() => setI((p) => (p + 1) % (generated ? generated.length : LINES.length))}>
          Next →
        </GlowButton>
        <GlowButton size="sm" onClick={generate} disabled={loading} variant="ghost">
          {loading ? "Generating…" : "Generate 3 affirmations"}
        </GlowButton>
      </div>
    </div>
  );
}

function BodyScan() {
  const PARTS = ["Crown of head", "Face & jaw", "Neck & shoulders", "Chest & heart", "Belly", "Hips", "Legs", "Feet"];
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">Body Scan</h3>
      <p className="text-sm text-muted-foreground mt-1">Spend a breath at each place.</p>
      <ol className="mt-5 flex flex-col gap-2">
        {PARTS.map((p, idx) => (
          <li key={p} className="flex items-center gap-3 rounded-xl glass px-3 py-2.5">
            <span className="font-mono text-xs text-muted-foreground w-6">{idx + 1}</span>
            <span className="text-sm">{p}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Soundscape() {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">Soundscape</h3>
      <p className="text-sm text-muted-foreground mt-1">Open in a new tab. Pick what fits the moment.</p>
      <div className="mt-4 flex flex-col gap-2">
        {[
          { name: "Rain", url: "https://www.youtube.com/results?search_query=gentle+rain+ambience" },
          { name: "Ocean", url: "https://www.youtube.com/results?search_query=ocean+waves+ambience" },
          { name: "Forest", url: "https://www.youtube.com/results?search_query=forest+ambience" },
          { name: "Soft piano", url: "https://www.youtube.com/results?search_query=soft+piano+for+anxiety" },
        ].map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="rounded-xl glass px-3 py-2.5 text-sm hover:bg-white/5 transition">
            {s.name} →
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground/70">Built-in player coming soon.</p>
    </div>
  );
}

function TaskBreakdown() {
  const [task, setTask] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!task.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const prompt = `Break this task into a clear list of tiny micro-steps: ${task.trim()}`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], systemPrompt: "You are a calm helper. Turn the task into a numbered list of small, doable steps." }),
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
      setResponse(acc.trim());
    } catch {
      setResponse("Sorry, I couldn’t create steps right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">Task Breakdown</h3>
      <p className="text-sm text-muted-foreground mt-1">Paste one task and get very small next steps.</p>
      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        rows={5}
        placeholder="The one thing I need to do…"
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="mt-3 flex gap-2">
        <GlowButton size="sm" onClick={submit} disabled={loading || !task.trim()}>
          {loading ? "Working…" : "Break it down"}
        </GlowButton>
      </div>
      {response && (
        <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function BodyDoubling() {
  const [copied, setCopied] = useState(false);
  const prompt = "I'll be here while you work. What's the one thing?";

  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">Body Doubling</h3>
      <p className="text-sm text-muted-foreground mt-1">A gentle prompt for shared focus.</p>
      <div className="mt-5 rounded-2xl bg-white/5 p-4">
        <p className="text-sm">{prompt}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <GlowButton
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? "Copied" : "Copy prompt"}
        </GlowButton>
      </div>
    </div>
  );
}

function TransitionTimer() {
  const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [running, seconds]);

  const start = () => {
    setSeconds(300);
    setRunning(true);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">Transition Timer</h3>
      <p className="text-sm text-muted-foreground mt-1">A gentle five-minute countdown to help you shift gears.</p>
      <div className="mt-6 rounded-2xl bg-white/5 p-6 text-center">
        <div className="text-4xl font-semibold">{`${minutes}:${secs.toString().padStart(2, "0")}`}</div>
        <p className="mt-2 text-sm text-muted-foreground">{seconds > 0 ? "Focus here until the timer ends." : "Time’s up. You did it."}</p>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        <GlowButton size="sm" onClick={start} disabled={running}>Start 5 min</GlowButton>
        <GlowButton size="sm" variant="ghost" onClick={() => setRunning(false)} disabled={!running}>Stop</GlowButton>
      </div>
    </div>
  );
}
