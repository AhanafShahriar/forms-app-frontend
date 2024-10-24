import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TemplateDetail = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(`/templates/${templateId}`);
      setTemplate(response.data);
    } catch (err) {
      setError("Error fetching template details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;

  // Ensure template is defined before accessing its properties
  if (!template) {
    return <p>No template found.</p>;
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>{template.title}</h1>
      <p className='text-lg mb-2'>{template.description}</p>
      <p className='font-semibold'>Topic: {template.topic}</p>
      <p className='font-semibold'>
        Tags: {template.tags ? template.tags.join(", ") : "No tags"}
      </p>
      <p className='font-semibold'>
        Users:{" "}
        {template.users
          ? template.users.map((user: any) => user.name).join(", ")
          : "No users"}
      </p>

      <h2 className='text-xl font-semibold mt-4'>Questions</h2>
      <ul className='list-disc pl-5'>
        {template.questions && template.questions.length > 0 ? (
          template.questions.map((question: any) => (
            <li key={question.id}>
              <strong>{question.title}</strong>: {question.description}
            </li>
          ))
        ) : (
          <li>No questions available.</li>
        )}
      </ul>

      {template.imageUrl && (
        <img
          src={template.imageUrl}
          alt='Template'
          className='mt-4'
        />
      )}
    </div>
  );
};

export default TemplateDetail;
