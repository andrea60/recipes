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
    <div className="flex flex-col h-full relative bg-secondary">
      <div className="p-6 pb-4">
        <h1 className="font-extrabold text-2xl">Your Recipes Cookbook</h1>
      </div>
      <div className="bg-base-200 flex-1 p-6 pt-4 rounded-t-3xl shadow-md">
        <Outlet />
      </div>
      <div className="bg-base-100 fixed bottom-0 left-0 w-full shadow-lg rounded-t-3xl pt-2">
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
      </div>
    </div>
  );
}
