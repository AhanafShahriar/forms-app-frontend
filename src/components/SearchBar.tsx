// src/components/SearchBar.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className='flex items-center'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search templates...'
        className='p-2 rounded-l-md'
      />
      <button
        type='submit'
        className='bg-blue-700 text-white p-2 rounded-r-md'>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
