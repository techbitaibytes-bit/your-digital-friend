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
    <div className="min-h-screen flex w-full">
      <SanctuarySidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
}
