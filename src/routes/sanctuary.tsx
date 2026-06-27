import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SanctuarySidebar, MobileBottomNav } from "@/components/SanctuarySidebar";

export const Route = createFileRoute("/sanctuary")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/sanctuary" || location.pathname === "/sanctuary/") {
      throw redirect({ to: "/sanctuary/chat" });
    }
  },
  component: SanctuaryLayout,
});

function SanctuaryLayout() {
  return (
    <div className="h-screen min-h-screen flex w-full overflow-hidden">
      <SanctuarySidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
}
