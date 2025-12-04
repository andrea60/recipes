import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import "./tiptap.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { VibrateActuator } from "./utils/vibrate";
import { gestureDetector } from "./utils/gesture-detection";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    pageTitle: "",
  },
  defaultViewTransition: {
    types: ({ fromLocation, toLocation }) => {
      if (gestureDetector.hasSwipedInLast(250)) return false;
      let direction = "none";
      if (fromLocation && fromLocation.pathname !== toLocation.pathname) {
        if (toLocation.pathname.startsWith(fromLocation.pathname))
          direction = "left";
        else if (fromLocation.pathname.startsWith(toLocation.pathname))
          direction = "right";
      }

      return [`slide-${direction}`];
    },
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

gestureDetector.startListening();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <VibrateActuator />
      <RouterProvider router={router} />
    </StrictMode>
  );
}
