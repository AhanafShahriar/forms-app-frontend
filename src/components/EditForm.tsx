import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

interface Answer {
  questionId: number;
  value: string;
}

interface FilledForm {
  id: number;
  answers: Answer[];
}

const EditForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [filledForm, setFilledForm] = useState<FilledForm | null>(null);
  const [updatedAnswers, setUpdatedAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const fetchFilledFormDetails = async () => {
      try {
        const response = await axios.get<FilledForm>(`/api/forms/${formId}`);
        setFilledForm(response.data);
        setUpdatedAnswers(response.data.answers); // Initialize updated answers
      } catch (error) {
        console.error("Error fetching filled form details:", error);
      }
    };

    fetchFilledFormDetails();
  }, [formId]);

  const handleInputChange = (questionId: number, value: string) => {
    setUpdatedAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId ? { ...answer, value } : answer
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/forms/${formId}`, { answers: updatedAnswers });
      alert("Form updated successfully.");
      navigate(`/forms/${formId}`); // Redirect to form detail page
    } catch (error) {
      console.error("Error updating filled form:", error);
      alert("Failed to update the form.");
    }
  };

  if (!filledForm) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Edit Filled Form</h2>
      <form onSubmit={handleSubmit}>
        {updatedAnswers.map((answer) => (
          <div
            key={answer.questionId}
            className='mb-4'>
            <label className='block mb-2'>
              Question ID {answer.questionId}:
            </label>
            <input
              type='text'
              value={answer.value}
              onChange={(e) =>
                handleInputChange(answer.questionId, e.target.value)
              }
              className='border p-2 rounded w-full'
              required
            />
          </div>
        ))}
        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
          Update Form
        </button>
      </form>
      <Link
        to={`/forms/${formId}`}
        className='text-blue-500 underline mt-4 block'>
        Back to Form Details
      </Link>
    </div>
  );
};

export default EditForm;
