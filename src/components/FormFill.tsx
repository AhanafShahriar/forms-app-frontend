import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Option {
  id: string;
  value: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
  options?: Option[];
}

interface TemplateResponse {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}
const apiUrl = process.env.REACT_APP_API_URL;
const FormFill: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<TemplateResponse | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>(
    {}
  );
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get<TemplateResponse>(
          `${apiUrl}/templates/${templateId}`
        );
        setTemplate(response.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleChange = (questionId: number, value: string | string[]) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
    setErrorMessages((prevErrors) => ({ ...prevErrors, [questionId]: "" })); // Clear error message on change
  };

  const handleSingleLineChange = (questionId: number, value: string) => {
    if (value.length > 100) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [questionId]: "Input cannot exceed 100 characters.",
      }));
    } else {
      handleChange(questionId, value);
    }
  };

  const handleMultiLineChange = (questionId: number, value: string) => {
    if (value.length > 250) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [questionId]: "Input cannot exceed 250 characters.",
      }));
    } else {
      handleChange(questionId, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Retrieve the token from local storage or your state management solution
    const token = localStorage.getItem("token"); // Adjust this line based on where you store your token

    try {
      await axios.post(
        `${apiUrl}/forms`,
        {
          templateId: Number(templateId),
          answers: Object.keys(answers).map((questionId) => {
            const answer = answers[Number(questionId)];
            return {
              questionId: Number(questionId),
              value: Array.isArray(answer) ? answer.join(", ") : answer,
            };
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token in the headers
          },
        }
      );

      // Navigate to the forms page after successful submission
      navigate(`/templates/${templateId}/forms`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto w-3/5 shadow-lg mt-10 mb-10 p-10'>
      <h2 className='text-2xl font-bold mb-4'>{template.title}</h2>
      <p className='mb-4'>{template.description}</p>
      <form onSubmit={handleSubmit}>
        {template.questions.map((question) => (
          <div
            key={question.id}
            className='mb-4'>
            <label className='block text-lg font-semibold mb-2'>
              {question.title}
            </label>
            <p className='mb-2 text-gray-600'>{question.description}</p>
            {question.type === "SINGLE_LINE" && (
              <>
                <input
                  type='text'
                  className='border p-2 rounded w-full'
                  onChange={(e) =>
                    handleSingleLineChange(question.id, e.target.value)
                  }
                />
                {errorMessages[question.id] && (
                  <p className='text-red-500'>{errorMessages[question.id]}</p>
                )}
              </>
            )}
            {question.type === "MULTI_LINE" && (
              <>
                <textarea
                  className='border p-2 rounded w-full'
                  onChange={(e) =>
                    handleMultiLineChange(question.id, e.target.value)
                  }
                />
                {errorMessages[question.id] && (
                  <p className='text-red-500'>{errorMessages[question.id]}</p>
                )}
              </>
            )}
            {question.type === "INTEGER" && (
              <input
                type='number'
                className='border p-2 rounded w-full'
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            )}
            {question.type === "CHECKBOX" && question.options && (
              <div>
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className='block'>
                    <input
                      className='mr-2 mt-1'
                      type='checkbox'
                      value={option.value}
                      onChange={(e) => {
                        const selectedOptions =
                          (answers[question.id] as string[]) || [];
                        if (e.target.checked) {
                          selectedOptions.push(option.value);
                        } else {
                          const index = selectedOptions.indexOf(option.value);
                          if (index > -1) {
                            selectedOptions.splice(index, 1);
                          }
                        }
                        handleChange(question.id, selectedOptions);
                      }}
                    />
                    {option.value}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormFill;
