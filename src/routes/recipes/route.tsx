import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "../../firebase/firebase.config";
import { ModalRenderer } from "../../components/modal/useModal";
import { ToastRenderer } from "../../components/toastr/useToast";
import { CategoriesProvider } from "../../data/Categories";
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
    <CategoriesProvider>
      <ModalRenderer />
      <ToastRenderer />
      <div className="flex flex-col h-full relative overflow-x-hidden">
        <div className="background flex-1 flex flex-col h-full [view-transition-name:main-content]">
          <Outlet />
        </div>
      </div>
    </CategoriesProvider>
  );
}
