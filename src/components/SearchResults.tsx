// SearchResults.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
const apiUrl = process.env.API_URL;
interface Template {
  id: number; // Adjust the type based on your schema
  title: string;
  description: string;
  // Add any other fields you expect from the API response
}

const SearchResults: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || searchParams.get("tag");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get<Template[]>(
          `${apiUrl}/templates/search`,
          {
            params: { query },
          }
        );
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchTemplates();
  }, [query]);

  if (!templates.length) {
    return <div>No templates found for "{query}".</div>;
  }

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.id}>{template.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
