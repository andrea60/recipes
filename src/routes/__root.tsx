import { createRootRoute, Outlet } from "@tanstack/react-router";
import { type FileRoutesByTo } from "../routeTree.gen";

export const Route = createRootRoute({
  component: () => (
    <main className="h-full w-full bg-base-200 [&_.card]:bg-base-100 [&_.card]:border-base-300">
      <Outlet />
    </main>
  ),
});

export type TRoutes = keyof FileRoutesByTo;
