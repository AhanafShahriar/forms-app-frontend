import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Answer {
  questionId: number;
  value: string;
}

interface Option {
  id: string;
  value: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  type: string; // e.g., "SINGLE_LINE", "MULTI_LINE", "CHECKBOX", "INTEGER"
  options?: Option[]; // For checkbox and radio options
}

interface FilledForm {
  id: number;
  answers: Answer[];
  template: {
    questions: Question[];
  };
}
const apiUrl = process.env.REACT_APP_API_URL;
const EditForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [filledForm, setFilledForm] = useState<FilledForm | null>(null);
  const [updatedAnswers, setUpdatedAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const fetchFilledFormDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<FilledForm>(
          `${apiUrl}/forms/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFilledForm(response.data);
        setUpdatedAnswers(response.data.answers);
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

  const handleCheckboxChange = (questionId: number, option: string) => {
    const currentAnswer = updatedAnswers.find(
      (a) => a.questionId === questionId
    );

    if (currentAnswer) {
      const currentValues = currentAnswer.value.split(" ").filter(Boolean); // Split and filter empty values
      const newValue = currentValues.includes(option)
        ? currentValues.filter((val) => val !== option).join(" ") // Unselect
        : [...currentValues, option].join(" "); // Select

      setUpdatedAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.questionId === questionId
            ? { ...answer, value: newValue }
            : answer
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${apiUrl}/forms/${formId}`,
        { answers: updatedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Form updated successfully.");
      navigate(`/forms/${formId}`);
    } catch (error) {
      console.error("Error updating filled form:", error);
      alert("Failed to update the form.");
    }
  };

  if (!filledForm) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto p-10 shadow-lg rounded mt-10 mb-10 w-3/5'>
      <h2 className='text-2xl font-bold mb-10 text-center'>Edit Filled Form</h2>
      <form onSubmit={handleSubmit}>
        {filledForm.template.questions.map((question) => {
          const answer = updatedAnswers.find(
            (a) => a.questionId === question.id
          );
          return (
            <div
              key={question.id}
              className='mb-4'>
              <label className='block mb-2'>
                <strong>{question.title}</strong>
                <p className='text-gray-600 mb-4'>{question.description}</p>
              </label>
              {question.type === "SINGLE_LINE" ? (
                <input
                  type='text'
                  value={answer?.value || ""}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  className='w-full p-2 text-sm text-gray-700 border mb-4'
                />
              ) : question.type === "MULTI_LINE" ? (
                <textarea
                  value={answer?.value || ""}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  className='w-full p-2 text-sm text-gray-700 border mb-4'
                />
              ) : question.type === "CHECKBOX" ? (
                <div className='mb-10'>
                  {question.options?.map((option) => (
                    <div
                      key={option.id}
                      className='inline-block mr -4'>
                      <input
                        type='checkbox'
                        checked={answer?.value
                          .split(" ")
                          .includes(option.value)}
                        onChange={() =>
                          handleCheckboxChange(question.id, option.value)
                        }
                      />
                      <span className='ml-2 mr-10 '>{option.value}</span>
                    </div>
                  ))}
                </div>
              ) : question.type === "INTEGER" ? (
                <input
                  type='number'
                  value={answer?.value || ""}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  className='w-full p-2 text-sm text-gray-700 border mb-4'
                />
              ) : (
                <div>Other input types not implemented yet</div>
              )}
            </div>
          );
        })}
        <button
          type='submit'
          className='bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded'>
          Update Form
        </button>
      </form>
    </div>
  );
};

export default EditForm;
