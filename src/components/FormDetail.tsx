import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

interface Answer {
  questionId: number;
  value: string;
}

interface FilledForm {
  id: number;
  answers: Answer[];
  user: { username: string };
}

const FormDetail: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [filledForm, setFilledForm] = useState<FilledForm | null>(null);

  useEffect(() => {
    const fetchFilledFormDetails = async () => {
      try {
        const response = await axios.get<FilledForm>(`/api/forms/${formId}`);
        setFilledForm(response.data);
      } catch (error) {
        console.error("Error fetching filled form details:", error);
      }
    };

    fetchFilledFormDetails();
  }, [formId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/forms/${formId}`);
      alert("Form deleted successfully.");
      navigate("/user/forms"); // Redirect to user's filled forms page
    } catch (error) {
      console.error("Error deleting filled form:", error);
      alert("Failed to delete the form.");
    }
  };

  if (!filledForm) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Filled Form Details</h2>
      <p>
        <strong>Form ID:</strong> {filledForm.id}
      </p>
      <p>
        <strong>Submitted by:</strong> {filledForm.user.username}
      </p>
      <h3 className='text-xl font-semibold mt-4'>Answers</h3>
      <ul className='list-disc list-inside'>
        {filledForm.answers.map((answer) => (
          <li key={answer.questionId}>
            <strong>Question ID {answer.questionId}:</strong> {answer.value}
          </li>
        ))}
      </ul>
      <div className='mt-4'>
        <Link
          to={`/forms/${filledForm.id}/edit`} // Redirect to edit form page (this should be created)
          className='bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 mr-2'>
          Edit Form
        </Link>
        <button
          onClick={handleDelete}
          className='bg-red-500 text-white p-2 rounded hover:bg-red-600'>
          Delete Form
        </button>
      </div>
      <Link
        to={`/templates`}
        className='text-blue-500 underline mt-4 block'>
        Back to Templates
      </Link>
    </div>
  );
};

export default FormDetail;
