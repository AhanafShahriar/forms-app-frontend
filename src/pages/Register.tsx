import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;
const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/auth/register`, { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md w-80'>
        <h1 className='text-xl font-bold mb-4 text-center'>Register</h1>
        {error && <p className='text-red-500'>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='border border-gray-300 p-2 rounded w-full mb-2'
          />
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
            Register
          </button>
        </form>
        <p className='text-gray-500 mt-4 text-center'>
          Already registered?{" "}
          <span
            className='text-blue-500 cursor-pointer'
            onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
