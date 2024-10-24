import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role: string; // Add the role property here
  profilePicture?: string; // Optional profile picture
  // Add any other user-related fields you need
}

interface AuthContextType {
  currentUser: User | null; // Track the currently logged-in user
  currentUserId: string | null; // Add this line
  isAuthenticated: boolean;
  isAdmin: boolean; // New field to track if the user is an admin
  login: (user: User) => void; // Modify login to accept user data
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for token in local storage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        setCurrentUser(storedUser);
        setIsAdmin(storedUser.role === "ADMIN"); // Check the user's role
      }
    }
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsAdmin(user.role === "ADMIN"); // Check if the user is an admin
    localStorage.setItem("user", JSON.stringify(user)); // Save user data to local storage
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user data from local storage
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserId: currentUser ? currentUser.id : null,
        isAuthenticated: !!currentUser,
        isAdmin,
        login,
        logout,
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
