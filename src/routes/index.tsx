import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { auth } from "../firebase/firebase.config";
import { useAuth } from "../auth/useAuth";
import { GoogleLogoIcon } from "@phosphor-icons/react";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    await auth.authStateReady();
    if (auth.currentUser) {
      console.log("Checking auth state, ", auth.currentUser);
      throw redirect({
        to: "/recipes",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const handleSignIn = async () => {
    const success = await signIn();
    if (!success) return;

    navigate({ to: "/recipes" });
  };

  return (
    <div className=" p-4 h-full w-full flex flex-col items-center justify-center">
      <h1 className="font-extrabold text-4xl mb-1">Recipes</h1>
      <h2 className="font-serif">Your personal recipe cookbbook</h2>
      <div className="card card-border card-sm w-full mt-6 shadow-xs">
        <div className="card-body">
          <h1 className="card-title self-center mb-2">Welcome Back!</h1>
          <button className="btn btn-primary" onClick={handleSignIn}>
            Sign-in using Google
          </button>
        </div>
      </div>
    </div>
  );
}
