import React, { useState } from "react";
import axios from "axios";

// Define the type for your search results
interface Template {
  id: number;
  title: string;
}
const apiUrl = process.env.REACT_APP_API_URL;
const Search: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Template[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      try {
        const response = await axios.get<Template[]>(
          `${apiUrl}/search?query=${query}`
        );
        setResults(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          placeholder='Search templates...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>

      <h2>Search Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <a href={`/templates/${result.id}`}>{result.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
