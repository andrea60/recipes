import { createFileRoute } from "@tanstack/react-router";
import { RecipeEditor } from "../../../components/editor/RecipeEditor";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const contentAtom = atomWithStorage<string | undefined>("test", undefined);

export const Route = createFileRoute("/recipes/add/")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      pageTitle: "Add Recipe",
    };
  },
});

function RouteComponent() {
  const [content, setContent] = useAtom(contentAtom);

  return (
    <div>
      <div className="flex flex-row border-b border-b-base-100 pb-3 mb-3">
        <h1 className="font-bold text-xl grow">Recipe Name</h1>
        <button className="btn btn-xs btn-primary mr-2">Ingredients</button>
        <button className="btn btn-xs btn-primary">Save</button>
      </div>

      <RecipeEditor initialContent={content || ""} onChange={setContent} />
    </div>
  );
}
