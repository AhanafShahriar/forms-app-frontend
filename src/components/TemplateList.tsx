import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Define an interface for the template data
interface Template {
  id: string;
  title: string;
  description: string;
}

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]); // Define the type for templates

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Use the Template type for the Axios response
        const response = await axios.get<Template[]>("/api/templates");
        setTemplates(response.data); // TypeScript now knows response.data is Template[]
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Available Templates</h2>
      <ul className='space-y-4'>
        {templates.map((template) => (
          <li
            key={template.id}
            className='border p-4 rounded shadow'>
            <h3 className='text-xl font-semibold'>{template.title}</h3>
            <p>{template.description}</p>
            <Link
              to={`/templates/${template.id}`}
              className='text-blue-500 underline'>
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;
