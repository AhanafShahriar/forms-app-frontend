import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
  role: string; // Ensure role is part of User interface
}

interface LoginResponse {
  token: string;
  user: User;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      // Debugging: Log the user object
      console.log("User data from API:", user);

      // Ensure the user object contains role
      if (user && user.id && user.email && user.role) {
        // Store token and user data in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Set default Authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Pass user to the login context
        login(user);
        navigate("/");
      } else {
        setError("User data is incomplete");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md w-80'>
        <h1 className='text-xl font-bold mb-4 text-center'>Login</h1>
        {error && <p className='text-red-500'>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='border border-gray-300 p-2 rounded w-full mb-2'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='border border-gray-300 p-2 rounded w-full mb-4'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white p-2 rounded w-full'>
            Login
          </button>
        </form>
        <p className='text-gray-500 mt-4 text-center'>
          Don't have an account?{" "}
          <span
            className='text-blue-500 cursor-pointer'
            onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
