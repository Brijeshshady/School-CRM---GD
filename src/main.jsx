import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/App";
import "./styles/fonts.css";
import "./styles/theme.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
      gcTime: 15 * 60 * 1000, // 15 minutes cache duration
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Use cached data immediately without mounting refetch skeletons
      refetchOnReconnect: true,
      retry: false, // Prevent persistent loading loops on network errors
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
