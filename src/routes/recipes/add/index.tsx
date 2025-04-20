import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes/add/")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      pageTitle: "Add Recipe",
    };
  },
});

function RouteComponent() {
  return <div>Hello "/recipes/add/"!</div>;
}
