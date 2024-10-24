import React, { useState } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
};

type UserSelectionProps = {
  users: User[];
  selectedUsers: User[];
  onUserToggle: (user: User) => void;
};

const UserSelection: React.FC<UserSelectionProps> = ({
  users,
  selectedUsers,
  onUserToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email">("name");

  // Filter and sort users based on the search query and selected sort option
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return a.email.localeCompare(b.email);
      }
    });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery) {
      const selectedUser = filteredUsers.find((user) =>
        sortBy === "name"
          ? user.name === searchQuery
          : user.email === searchQuery
      );
      if (selectedUser) {
        onUserToggle(selectedUser);
        setSearchQuery(""); // Clear input after selection
      }
    }
  };

  const handleSortChange = (sortOption: "name" | "email") => {
    setSortBy(sortOption);
    setSearchQuery(""); // Clear search query when changing sort option
  };

  return (
    <div className='space-y-4'>
      {/* Sort Options */}
      <div className='flex space-x-2 mt-2'>
        <button
          onClick={() => handleSortChange("name")}
          className={`p-2 rounded ${
            sortBy === "name" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}>
          Select by Name
        </button>
        <button
          onClick={() => handleSortChange("email")}
          className={`p-2 rounded ${
            sortBy === "email" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}>
          Select by Email
        </button>
      </div>

      {/* Search Input */}
      <input
        list='users'
        placeholder={
          sortBy === "name" ? "Add user by name..." : "Add user by email..."
        }
        value={searchQuery}
        onChange={handleSearchInputChange}
        onKeyDown={handleKeyDown}
        className='border p-2 w-full rounded'
      />
      {searchQuery && (
        <datalist id='users'>
          {filteredUsers.map((user) => (
            <option
              key={user.id}
              value={sortBy === "name" ? user.name : user.email}
            />
          ))}
        </datalist>
      )}

      {/* Selected Users Display */}
      <div className='flex flex-wrap mb-2'>
        {selectedUsers.map((user) => (
          <div
            key={user.id}
            className='flex items-center bg-blue-200 px-2 py-1 mr-2 rounded'>
            {user.name}
            <button
              onClick={() => onUserToggle(user)}
              className='ml-2 text-red-500'>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSelection;
