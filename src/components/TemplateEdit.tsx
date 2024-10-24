import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Define an interface for the template data
interface Template {
  id: string;
  title: string;
  description: string;
  topic: string;
  tags: { name: string }[]; // Assuming tags are objects with a 'name' property
}
const apiUrl = process.env.REACT_APP_API_URL;

const TemplateEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null); // Update the state type
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // Use the Template type for the Axios response
        const response = await axios.get<Template>(`${apiUrl}/templates/${id}`);
        setTemplate(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setTopic(response.data.topic);
        setTags(response.data.tags.map((tag) => tag.name));
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`{apiUrl}/api/templates/${id}`, {
        title,
        description,
        topic,
        tags,
      });
      alert("Template updated successfully!");
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Edit Template</h2>
      {template ? (
        <form
          onSubmit={handleUpdate}
          className='space-y-4'>
          <input
            type='text'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border p-2 rounded w-full'
          />
          <textarea
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border p-2 rounded w-full'
          />
          <input
            type='text'
            placeholder='Topic'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className='border p-2 rounded w-full'
          />
          <input
            type='text'
            placeholder='Tags (comma-separated)'
            value={tags.join(",")}
            onChange={(e) => setTags(e.target.value.split(","))}
            className='border p-2 rounded w-full'
          />

          <button
            type='submit'
            className='bg-blue-500 text-white p-2 rounded'>
            Update Template
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TemplateEdit;
