import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router";
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="max-w-screen-xl mx-auto">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  </StrictMode>
);
