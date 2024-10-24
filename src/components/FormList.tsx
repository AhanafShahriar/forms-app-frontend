import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

interface FilledForm {
  id: number;
  answers: { questionId: number; value: string }[];
  user: { username: string }; // Assuming you have user info in the filled form
}

const FormList: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [filledForms, setFilledForms] = useState<FilledForm[]>([]);

  useEffect(() => {
    const fetchFilledForms = async () => {
      try {
        const response = await axios.get<FilledForm[]>(
          `/api/forms/template/${templateId}`
        );
        setFilledForms(response.data);
      } catch (error) {
        console.error("Error fetching filled forms:", error);
      }
    };

    fetchFilledForms();
  }, [templateId]);

  const handleDelete = async (formId: number) => {
    try {
      await axios.delete(`/api/forms/${formId}`);
      setFilledForms((prev) => prev.filter((form) => form.id !== formId)); // Remove deleted form from state
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Filled Forms</h2>
      {filledForms.length > 0 ? (
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr>
              <th className='border border-gray-300 p-2'>ID</th>
              <th className='border border-gray-300 p-2'>User</th>
              <th className='border border-gray-300 p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filledForms.map((form) => (
              <tr key={form.id}>
                <td className='border border-gray-300 p-2'>{form.id}</td>
                <td className='border border-gray-300 p-2'>
                  {form.user.username}
                </td>
                <td className='border border-gray-300 p-2'>
                  <Link
                    to={`/forms/${form.id}`}
                    className='text-blue-500 underline mr-2'>
                    View Details
                  </Link>
                  <button
                    className='text-red-500'
                    onClick={() => handleDelete(form.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No filled forms available.</p>
      )}
    </div>
  );
};

export default FormList;
