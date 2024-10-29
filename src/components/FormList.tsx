import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

interface FilledForm {
  id: number;
  answers: { questionId: number; value: string }[];
  user: { name: string }; // Assuming you have user info in the filled form
}

interface Template {
  id: number;
  creatorId: string; // Assuming you have a creatorId field
}

const apiUrl = process.env.REACT_APP_API_URL;

const FormList: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [filledForms, setFilledForms] = useState<FilledForm[]>([]);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFilledForms = async () => {
      const token = localStorage.getItem("token");
      try {
        // Fetch template to check the creator
        const templateResponse = await axios.get<Template>(
          `${apiUrl}/templates/${templateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentUserId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
        if (templateResponse.data.creatorId === currentUserId) {
          setIsCreator(true);
          // Fetch filled forms only if the user is the creator
          const formsResponse = await axios.get<FilledForm[]>(
            `${apiUrl}/forms/template/${templateId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFilledForms(formsResponse.data);
        } else {
          setIsCreator(false);
        }
      } catch (error) {
        console.error("Error fetching filled forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilledForms();
  }, [templateId]);

  const handleDelete = async (formId: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiUrl}/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilledForms((prev) => prev.filter((form) => form.id !== formId)); // Remove deleted form from state
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isCreator) {
    return <p>You do not have permission to view this list.</p>;
  }

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Filled Forms</h2>
      {filledForms.length > 0 ? (
        <table className='min-w-full text-center border-collapse border border-gray-300'>
          <thead>
            <tr>
              <th className='border border-gray-300 p-2'>ID</th>
              <th className='border border-gray-300 p-2'>User </th>
              <th className='border border-gray-300 p-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filledForms.map((form) => (
              <tr key={form.id}>
                <td className='border border-gray-300 p-2'>{form.id}</td>
                <td className='border border-gray-300 p-2'>{form.user.name}</td>
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
