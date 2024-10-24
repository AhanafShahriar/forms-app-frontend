import React, { useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  users: User[];
  selectedUsers: User[];
  onUserToggle: (user: User) => void;
}

const AutocompleteUserSearch: React.FC<Props> = ({
  users,
  selectedUsers,
  onUserToggle,
}) => {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Filter users based on search input
  useEffect(() => {
    if (search === "") {
      setFilteredUsers([]);
      return;
    }

    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredUsers(results);
  }, [search, users]);

  // Check if the user is already selected
  const isSelected = (user: User) =>
    selectedUsers.some((selected) => selected.id === user.id);

  return (
    <div className='autocomplete-user-search'>
      {/* Input Field for Searching Users */}
      <input
        type='text'
        placeholder='Search users by name or email'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />

      {/* Dropdown List */}
      {filteredUsers.length > 0 && (
        <ul className='border border-gray-300 rounded w-full max-h-40 overflow-y-auto bg-white'>
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => {
                onUserToggle(user);
                setSearch(""); // Reset search after selection
              }}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                isSelected(user) ? "bg-gray-200" : ""
              }`}>
              <span>
                {user.name} ({user.email})
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Selected Users */}
      <div className='selected-users mt-2 flex flex-wrap'>
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className='inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 m-1'>
            <span>{user.name}</span>
            <button
              onClick={() => onUserToggle(user)}
              className='ml-2 text-red-600 font-bold'>
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutocompleteUserSearch;
