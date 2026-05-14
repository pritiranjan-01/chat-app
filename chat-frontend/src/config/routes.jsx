import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router";

const HomePage = lazy(() => import("../components/home/HomePage"));
const ChatPage = lazy(() => import("../components/chat/ChatPage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Loading...
    </p>
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-700">404</h1>
      <p className="text-gray-500 mt-2">Page not found</p>
      <a
        href="/"
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        Go home
      </a>
    </div>
  </div>
);

export default AppRoutes;
