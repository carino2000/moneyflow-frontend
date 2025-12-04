import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import IndexPage from "./pages/IndexPage";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import FlowWritePage from "./pages/FlowWritePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/flow/write",
    element: <FlowWritePage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
