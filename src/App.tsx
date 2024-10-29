import React, { useEffect } from "react";
import AppRouter from "./Router";
import { useAuth } from "./contexts/AuthContext";
import "./i18n";

function App() {
  const { theme } = useAuth();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "DARK");
  }, [theme]);

  return (
    <div
      className={`App min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition duration-300`}>
      <AppRouter />
    </div>
  );
}

export default App;
