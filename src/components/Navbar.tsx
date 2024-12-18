import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className='flex items-center justify-between p-4 bg-blue-600 text-white'>
      <div className='text-lg font-bold'>
        <Link to='/'>FormsApp</Link>
      </div>
      <div className='flex items-center gap-6'>
        <SearchBar />
        {currentUser ? (
          <>
            <div className='relative ml-4'>
              <button
                onClick={toggleDropdown}
                className='focus:outline-none'>
                {currentUser.name}
              </button>
              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10'>
                  <Link
                    to='/user/personal'
                    className='block px-4 py-2'>
                    Personal Page
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='block px-4 py-2 w-full text-left'>
                    Logout
                  </button>
                </div>
              )}
            </div>
            {isAdmin && (
              <Link
                to='/admin'
                className='ml-4'>
                Admin Dashboard
              </Link>
            )}
            <Link
              to='/templates/create'
              className='ml-4'>
              Create
            </Link>
          </>
        ) : (
          <>
            <Link
              to='/login'
              className='ml-4'>
              Login
            </Link>
            <Link
              to='/register'
              className='ml-4'>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
