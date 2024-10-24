// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Import App instead of AppRouter
import { AuthProvider } from "./contexts/AuthContext";

// Get the root container
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

// Create the root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App /> {/* Render App here */}
    </AuthProvider>
  </React.StrictMode>
);
