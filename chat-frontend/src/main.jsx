import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import AppRoutes from "./config/routes.jsx";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster
      position="top-center"
      containerStyle={{ zIndex: 20000 }}
      toastOptions={{
        style: {
          background: "#111827",
          border: "1px solid rgba(96, 165, 250, 0.35)",
          color: "#f8fafc",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.45)",
        },
      }}
    />
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  </BrowserRouter>,
);
