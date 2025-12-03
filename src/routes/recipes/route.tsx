import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "../../firebase/firebase.config";
export const Route = createFileRoute("/recipes")({
  component: RouteComponent,
  beforeLoad: async () => {
    await auth.authStateReady();
    if (!auth.currentUser) {
      throw redirect({
        to: "..",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full relative overflow-x-hidden">
      <div className="background flex-1 flex flex-col h-full [view-transition-name:main-content]">
        <Outlet />
      </div>
    </div>
  );
}
