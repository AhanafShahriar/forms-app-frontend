import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

interface Author {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  language: string;
  theme: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  author: Author;
  image: string | null;
  filledCount: number;
}

interface Tag {
  id: string;
  name: string;
}
const apiUrl = process.env.REACT_APP_API_URL;
const HomePage: React.FC = () => {
  const [latestTemplates, setLatestTemplates] = useState<Template[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<Template[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // State to trigger refresh
  const navigate = useNavigate();

  const fetchTemplatesAndTags = async () => {
    setLoading(true);
    try {
      const latestResponse = await axios.get<Template[]>(
        `${apiUrl}/templates/latest`
      );
      const popularResponse = await axios.get<Template[]>(
        `${apiUrl}/templates/popular`
      );
      const tagsResponse = await axios.get<Tag[]>(`${apiUrl}/templates/tags`);

      // Limit to 5 templates for each section
      setLatestTemplates(latestResponse.data.slice(0, 5));
      setPopularTemplates(popularResponse.data.slice(0, 5));
      setTags(tagsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch templates and tags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplatesAndTags();
  }, [refresh]); // Re-fetch when refresh changes

  // Update the refresh state when navigating back from TemplateCreation
  const location = useLocation();
  useEffect(() => {
    if (location.state?.refresh) {
      setRefresh((prev) => !prev); // Toggle refresh state
    }
  }, [location.state]);

  if (loading) {
    return <div>Loading templates...</div>;
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div className='p-4'>
      {/* Latest Templates */}
      <h1 className='text-2xl font-bold mb-4'>Latest Templates</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {latestTemplates.map((template) => (
          <div
            key={template.id}
            className='border p-4 rounded-lg shadow'
            onClick={() => navigate(`/templates/${template.id}`)}>
            <h3 className='font-bold text-blue-600 hover:underline cursor-pointer'>
              {template.title || "No Title"}
            </h3>
            <p>{template.description || "No Description"}</p>
            <p className='text-gray-600'>
              Author: {template.author?.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>

      {/* Top 5 Most Popular Templates */}
      <h2 className='text-xl font-bold mb-2'>Top 5 Most Popular Templates</h2>
      <table className='min-w-full border border-gray-300 mb-8'>
        <thead>
          <tr>
            <th className='border border-gray-300 px-4 py-2'>Template Name</th>
            <th className='border border-gray-300 px-4 py-2'>Filled Count</th>
          </tr>
        </thead>
        <tbody>
          {popularTemplates.map((template) => (
            <tr
              key={template.id}
              className='hover:bg-gray-100 cursor-pointer'
              onClick={() => navigate(`/templates/${template.id}`)}>
              <td className='border border-gray-300 px-4 py-2'>
                {template.title || "No Title"}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {template.filledCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tags Section */}
      <h2 className='text-xl font-bold mb-2'>Tags</h2>
      <div className='flex flex-wrap gap-2 mb-8'>
        {tags.map((tag) => (
          <span
            key={tag.id}
            className='bg-blue-200 px-2 py-1 rounded cursor-pointer hover:bg-blue-300'
            onClick={() => navigate(`/search?tag=${tag.name}`)}>
            {tag.name || "Unnamed Tag"}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
