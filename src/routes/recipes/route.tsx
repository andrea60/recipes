import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { NavigationBar } from "../../components/NavigationBar";
import {
  ListBulletIcon,
  PlusIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../auth/useAuth";
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
  const { signOut } = useAuth();
  return (
    <div className="flex flex-col h-full relative">
      <div className="background flex-1 p-4 flex flex-col">
        <Outlet />
      </div>
      {/* <div className="glass-bg border border-base-300 fixed bottom-0 left-0 w-full shadow-lg rounded-t-3xl pt-2">
        <NavigationBar
          links={[
            { to: "/recipes", icon: ListBulletIcon, label: "Recipes" },
            { to: "/recipes/add", icon: PlusIcon, label: "Add Recipe" },
            {
              onClick: signOut,
              icon: ArrowRightEndOnRectangleIcon,
              label: "Sign Out",
            },
          ]}
        />
      </div> */}
    </div>
  );
}
