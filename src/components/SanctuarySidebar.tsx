import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Eye, Sparkles, LifeBuoy, Moon, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/sanctuary/chat", label: "Chat", icon: MessageCircle },
  { to: "/sanctuary/mirror", label: "Mood Mirror", icon: Eye },
  { to: "/sanctuary/toolkit", label: "Healing", icon: Sparkles },
  { to: "/sanctuary/insights", label: "Insights", icon: BarChart2 },
  { to: "/sanctuary/crisis", label: "Crisis", icon: LifeBuoy },
] as const;

export function SanctuarySidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex flex-col items-center gap-2 w-20 lg:w-60 shrink-0 py-6 px-3 glass-strong border-r border-white/10 z-10">
      <Link to="/" className="group mb-4 flex items-center gap-2 px-2">
        <div className="relative grid h-10 w-10 place-items-center rounded-2xl shimmer-border" style={{ background: "var(--gradient-cta)" }}>
          <Moon className="h-5 w-5 text-white" />
          <span className="absolute inset-0 rounded-2xl opacity-50 blur-xl" style={{ background: "var(--gradient-cta)" }} />
        </div>
        <span className="hidden lg:inline font-semibold tracking-tight">EmpathAI</span>
      </Link>

      <nav className="flex flex-col gap-1 w-full">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                "lg:justify-start justify-center",
                active
                  ? "text-foreground bg-white/10 glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/10",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="hidden lg:inline truncate">{item.label}</span>
              {active && <span className="hidden lg:block absolute right-2 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_oklch(0.78_0.16_200/0.8)]" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden lg:block text-[10px] leading-snug text-muted-foreground/70 px-2">
        Your sanctuary. Private. Not a substitute for professional care.
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-30 glass-strong rounded-[1.25rem] px-2 py-2 flex items-center justify-around">
      {NAV.map((item) => {
        const active = pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-label={item.label}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] transition-colors",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_oklch(0.78_0.16_200/0.8)]")} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
