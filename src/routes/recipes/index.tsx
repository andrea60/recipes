import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes/")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      pageTitle: "Recipes",
    };
  },
});

function RouteComponent() {
  return (
    <div className="card card-border card-sm">
      <div className="card-body">Example Card content</div>
    </div>
  );
}
