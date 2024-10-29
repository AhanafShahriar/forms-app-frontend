import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  role: string;
  profilePicture?: string;
}

interface UserPreferences {
  language: string; // Language preference
  theme: string;
}

interface AuthContextType {
  currentUser: User | null;
  currentUserId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  language: string; // Added for language preference
  theme: string; // Added for theme preference
  login: (user: User) => void;
  logout: () => void;
  updatePreferences: (
    token: string,
    newLanguage: string,
    newTheme: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState("ENGLISH"); // Default language
  const [theme, setTheme] = useState("LIGHT"); // Default theme

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        setCurrentUser(storedUser);
        setIsAdmin(storedUser.role === "ADMIN");
        fetchUserPreferences(token); // Fetch preferences on initial load
      }
    }
  }, []);

  const login = async (user: User) => {
    setCurrentUser(user);
    setIsAdmin(user.role === "ADMIN");
    localStorage.setItem("user", JSON.stringify(user));

    // Fetch user preferences including language
    const token = localStorage.getItem("token");
    if (token) {
      await fetchUserPreferences(token);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setTheme("LIGHT");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("appTheme");
    localStorage.removeItem("language");
  };

  const fetchUserPreferences = async (token: string) => {
    try {
      const response = await axios.get<UserPreferences>("/user/preferences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLanguage(response.data.language);
      setTheme(response.data.theme);
      localStorage.setItem("language", response.data.language); // Store language in local storage
      localStorage.setItem("appTheme", response.data.theme); // Store theme in local storage
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const updatePreferences = async (
    token: string,
    newLanguage: string,
    newTheme: string
  ) => {
    try {
      await axios.patch(
        "/user/preferences",
        { language: newLanguage, theme: newTheme },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLanguage(newLanguage);
      setTheme(newTheme);
      localStorage.setItem("language", newLanguage);
      localStorage.setItem("appTheme", newTheme);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserId: currentUser ? currentUser.id : null,
        isAuthenticated: !!currentUser,
        isAdmin,
        language,
        theme,
        login,
        logout,
        updatePreferences,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
