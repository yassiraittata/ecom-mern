import { createBrowserRouter } from "react-router-dom";

import CustomerLayout from "./components/layout/CustomerLayout";
import StoreHome from "./pages/customer/Home";
import PublicLayout from "./components/auth/PublicLayout";
import SigninPage from "./pages/auth/SigninPage";
import SignupPage from "./pages/auth/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <StoreHome />,
      },
      {
        element: <PublicLayout />,
        children: [
          {
            path: "signin/*",
            element: <SigninPage />,
          },
          { path: "signup/*", element: <SignupPage /> },
        ],
      },
    ],
  },
]);
