import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, type ComponentType } from "react";
import { motion } from "motion/react";
import { Phone, MessageSquare, Globe, ShieldAlert, Loader2, Users, MapPin, Link2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { GlassCard } from "@/components/GlassCard";
import { GlowButton } from "@/components/GlowButton";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export const Route = createFileRoute("/sanctuary/crisis")({
  head: () => ({ meta: [{ title: "Crisis Help — EmpathAI" }] }),
  component: CrisisPage,
});

type SupportItem = {
  name: string;
  type: string;
  phone: string;
  website: string;
  description: string;
};

function extractJsonArray(raw: string): SupportItem[] {
  // Find first '[' and last ']' to isolate JSON even if model adds prose/code fences.
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return [];
  const slice = raw.slice(start, end + 1);
  try {
    const arr = JSON.parse(slice);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((r: any): SupportItem => ({
        name: String(r?.name ?? "").trim(),
        type: String(r?.type ?? "").trim(),
        phone: String(r?.phone ?? "").trim(),
        website: String(r?.website ?? "").trim(),
        description: String(r?.description ?? "").trim(),
      }))
      .filter((r) => r.name && (r.phone || r.website));
  } catch {
    return [];
  }
}

const SUPPORT_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  hotline: Phone,
  crisis: Phone,
  text: MessageSquare,
  counseling: Users,
  group: Users,
  online: Globe,
  lgbtq: Link2,
  default: MapPin,
};

function CrisisPage() {
  const [city, setCity] = useState("");
  const [resultsText, setResultsText] = useState("");
  const [supportItems, setSupportItems] = useState<SupportItem[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const findLocal = useCallback(async () => {
    const q = city.trim();
    if (!q) {
      setError("Please enter a city.");
      return;
    }
    setError(null);
    setResultsText("");
    setSupportItems([]);
    setStreaming(true);

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const prompt = `You are a resource locator. The user is in "${q}" and is a teen/young adult seeking mental health and neurodiverse support.

Return ONLY a valid JSON array (no prose, no markdown, no code fences) of 5-8 REAL, well-known resources serving that location. Prefer national crisis lines that work for that country + reputable youth/LGBTQ+/neurodiverse services. Do NOT invent organizations or numbers. If unsure of a local org, use a verified national one for that country.

Each item must be an object with EXACTLY these keys:
{
  "name": "Organization name",
  "type": "Crisis Hotline | Text Line | Counseling | Support Group | Online | LGBTQ+",
  "phone": "Exact dialable number with country code if international, or empty string",
  "website": "https://... or empty string",
  "description": "One short warm sentence (max 20 words) about what they offer."
}

Output JUST the JSON array, starting with [ and ending with ].`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          systemPrompt: "You output only valid JSON when asked. Never wrap in markdown or add commentary.",
        }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const body = await res.text().catch(() => "");
        throw new Error(body || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setResultsText(acc);
      }
      setSupportItems(extractJsonArray(acc));
    } catch (e) {
      if ((e as any).name === "AbortError") {
        setError("Search cancelled.");
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [city]);

  const iconForType = (type: string) => {
    const lower = type.toLowerCase();
    const Icon = Object.entries(SUPPORT_ICON_MAP).find(([key]) => lower.includes(key))?.[1] ?? SUPPORT_ICON_MAP.default;
    return Icon;
  };

  const copyToClipboard = async (value: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      }
    } catch {
      // Ignore clipboard issues and keep the flow moving.
    }
  };

  return (
    <>
      <AnimatedBackground />
      <TopBar />

      <div className="flex-1 px-4 lg:px-6 py-4 pb-28 md:pb-4">
        <div className="mx-auto max-w-4xl grid gap-4">
          <GlassCard strong glow="accent" className="p-6 border-accent/30">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-accent shrink-0 mt-0.5" />
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Find Support Near Me</h1>
                <p className="mt-1 text-sm text-muted-foreground">Search for local teen mental health and neurodiverse resources with warm, practical next steps.</p>
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <a href="tel:988" className="flex items-center gap-3 rounded-2xl glass px-4 py-3 hover:bg-white/5 transition">
                <Phone className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-semibold">Call 988</div>
                  <div className="text-xs text-muted-foreground">US Suicide & Crisis Lifeline · 24/7</div>
                </div>
              </a>
              <a href="sms:741741?body=HOME" className="flex items-center gap-3 rounded-2xl glass px-4 py-3 hover:bg-white/5 transition">
                <MessageSquare className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-semibold">Text HOME to 741741</div>
                  <div className="text-xs text-muted-foreground">Crisis Text Line · US/CA</div>
                </div>
              </a>
              <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl glass px-4 py-3 hover:bg-white/5 transition sm:col-span-2">
                <Globe className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-semibold">findahelpline.com</div>
                  <div className="text-xs text-muted-foreground">International directory of free helplines</div>
                </div>
              </a>
              <a href="tel:9152987821" className="flex items-center gap-3 rounded-2xl glass px-4 py-3 hover:bg-white/5 transition sm:col-span-2">
                <Phone className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-semibold">iCall India — 9152987821</div>
                  <div className="text-xs text-muted-foreground">Free counselling · Mon–Sat 8am–10pm IST</div>
                </div>
              </a>
            </div>
          </GlassCard>

          <GlassCard className="mt-4 p-6">
            <h2 className="text-lg font-semibold tracking-tight">Right now: a grounding breath</h2>
            <p className="mt-1 text-sm text-muted-foreground">Breathe in for 4. Hold for 7. Out for 8. Repeat.</p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <motion.div
                className="h-28 w-28 rounded-full"
                style={{
                  background: 'radial-gradient(circle, oklch(0.62 0.22 290 / 0.6), oklch(0.78 0.16 200 / 0.2))',
                  boxShadow: '0 0 40px oklch(0.62 0.22 290 / 0.3)',
                }}
                animate={{ scale: [1, 1.4, 1.4, 1, 1] }}
                transition={{
                  duration: 19,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.21, 0.58, 0.79, 1],
                }}
              />
              <p className="text-xs text-muted-foreground/70">Follow the circle. Let your breath lead.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold tracking-tight">Find Support Near Me</h2>
            <p className="mt-1 text-sm text-muted-foreground">Enter a city or postal code and the AI will suggest nearby teen-friendly resources.</p>

            <div className="mt-4 flex gap-3 flex-col sm:flex-row">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or postal code"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <GlowButton size="sm" onClick={findLocal} disabled={streaming}>
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find Support"}
              </GlowButton>
            </div>

            <div className="mt-4 space-y-4">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">988 Suicide & Crisis Lifeline</p>
                    <p className="text-xs text-muted-foreground">Always available 24/7 in the US — call or text 988.</p>
                  </div>
                  <GlowButton size="sm" variant="ghost" onClick={() => copyToClipboard("988")}>Copy</GlowButton>
                </div>
              </GlassCard>

              {error && <div className="text-xs text-destructive">{error}</div>}

              {streaming && !resultsText && <div className="text-sm text-muted-foreground">Searching...</div>}

              {supportItems.length > 0 ? (
                <div className="grid gap-3">
                  {supportItems.map((item, index) => {
                    const Icon = iconForType(item.type);
                    return (
                      <div key={`${item.name}-${index}`} className="rounded-2xl glass px-4 py-3">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{item.name}</div>
                            {item.type && <div className="text-xs text-accent">{item.type}</div>}
                            {item.description && (
                              <div className="mt-1 text-xs text-muted-foreground">{item.description}</div>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.phone && (
                                <a
                                  href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-mono text-accent hover:bg-accent/25 transition"
                                >
                                  <Phone className="h-3 w-3" /> {item.phone}
                                </a>
                              )}
                              {item.website && (
                                <a
                                  href={item.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/15 transition"
                                >
                                  <Globe className="h-3 w-3" /> Visit site
                                </a>
                              )}
                              {item.phone && (
                                <button
                                  onClick={() => copyToClipboard(item.phone)}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs hover:bg-white/10 transition"
                                >
                                  Copy number
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !streaming && resultsText ? (
                  <div className="rounded-2xl bg-white/5 p-4 text-sm text-muted-foreground">
                    We couldn't format those suggestions yet. Please try again.
                  </div>
                ) : (
                  !streaming && (
                    <div className="rounded-2xl bg-white/5 p-4 text-sm text-muted-foreground">
                      No results yet. Enter a location and click Find Support.
                    </div>
                  )
                )
              )}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground">
                These suggestions are AI-generated. Always verify contact details before reaching out.
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
