import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Template {
  id: number;
  title: string;
  description: string;
}
const apiUrl = process.env.REACT_APP_API_URL;
const SearchResults: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [noResults, setNoResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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

        if (response.data.length === 0) {
          setTimeout(() => {
            setNoResults(true);
          }, 5000);
        } else {
          setNoResults(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [query]);

  if (loading) {
    return <div className='mt-5 ml-5'>Loading...</div>;
  }

  if (noResults) {
    return <div className='mt-5 ml-5'>No templates found for "{query}".</div>;
  }

  return (
    <div className='space-y-4 ml-5 mt-5'>
      <h2 className='text-xl font-semibold mb-4'>
        Search Results for "{query}"
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {templates.map((template) => (
          <div
            key={template.id}
            className='border p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => navigate(`/templates/${template.id}`)}>
            <h3 className='font-bold text-blue-600 hover:underline'>
              {template.title}
            </h3>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
