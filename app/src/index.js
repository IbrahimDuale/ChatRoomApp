import React from "react";
import ReactDOM from "react-dom/client"
import {
  createBrowserRouter,

  RouterProvider,
} from "react-router-dom";
import App from "./App";
import ChatRoomController from "./components/ChatRoomController/ChatRoomController";
import Error from "./components/Error/Error";
import LoginController from "./components/LoginController/LoginController";
import GlobalProvider from "./Context/GlobalProvider";
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GlobalProvider>
        <App />
      </GlobalProvider>
    ),
    errorElement: <Error />,
    children: [{
      index: true,
      element: (
        <LoginController />
      )
    },
    {
      path: "/chatroom",
      element: (
        <ChatRoomController />
      )
    }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);