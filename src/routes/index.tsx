import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Heart, Eye, Sparkles, ShieldCheck, MoonStar, Compass } from "lucide-react";
import { GlowButton } from "@/components/GlowButton";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedBackground } from "@/components/AnimatedBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EmpathAI — Private AI Companion for Teen Mental Wellness" },
      { name: "description", content: "A calm, private AI sanctuary for teens and young adults. Mood Mirror, healing toolkit, and crisis support — always available, never stored on servers." },
      { property: "og:title", content: "EmpathAI — Private AI Companion for Teen Mental Wellness" },
      { property: "og:description", content: "A private AI wellness sanctuary with mood mirror, healing toolkit, and crisis support." },
      { property: "og:url", content: "https://friendlypal.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://friendlypal.lovable.app/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <AnimatedBackground />
      <main className="relative min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-6 lg:px-12 py-6">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl shimmer-border" style={{ background: "var(--gradient-cta)" }}>
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <div>
              <div className="font-semibold tracking-tight">EmpathAI</div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Soft Twilight Sanctuary</div>
            </div>
          </div>
          <Link to="/sanctuary/chat" className="text-sm text-muted-foreground hover:text-foreground transition" aria-label="Enter the EmpathAI sanctuary">
            Enter sanctuary →
          </Link>
        </nav>

        <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_oklch(0.78_0.16_200/0.8)]" />
              Built with care • Privacy-first • Not a replacement for professional help
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] leading-[1.02]">
              A soft place to <span className="gradient-text">feel understood</span>.
            </h1>

            <p className="mt-7 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              EmpathAI is a calm, private sanctuary for teens and young adults — with a mood mirror, healing toolkit, and local crisis support that feel warm, practical, and genuinely human.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/sanctuary/chat">
                <GlowButton size="lg" className="breathe">
                  Enter Sanctuary <ArrowRight className="h-4 w-4" />
                </GlowButton>
              </Link>
              <Link to="/sanctuary/crisis" className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground transition hover:border-accent/40 hover:text-foreground">
                Need urgent support?
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Private by design</span>
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5"><MoonStar className="h-4 w-4 text-accent" /> Calm, nonjudgmental support</span>
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5"><Compass className="h-4 w-4 text-accent" /> Neurodiverse-friendly tools</span>
            </div>
          </motion.div>

          <div className="mt-20 w-full max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-8">What's inside the sanctuary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
              { icon: Heart, title: "Six gentle modes", body: "Switch between listener, coach, reflective, and caring support styles without losing the thread of the conversation." },
              { icon: Eye, title: "Mood Mirror", body: "Optional, on-device emotion sensing from your webcam with no uploads and a calm, private readout." },
              { icon: Sparkles, title: "Healing toolkit", body: "Body doubling, task breakdown, grounding, breathing, and soft affirmations built for real moments." },
            ].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 h-full text-left hover:-translate-y-1 transition-transform">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl glass-strong">
                    <b.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </GlassCard>
              </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="text-center py-8 text-xs text-muted-foreground/70">
          Not a substitute for professional care. Stored privately in your browser.
        </footer>
      </main>
    </>
  );
}
