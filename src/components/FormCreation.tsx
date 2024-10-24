import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  type: string;
}

interface TemplateResponse {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

const FormCreation: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchTemplateQuestions = async () => {
      try {
        const response = await axios.get<TemplateResponse>(
          `/api/templates/${templateId}`
        );
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchTemplateQuestions();
  }, [templateId]);

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/forms", {
        templateId: Number(templateId),
        answers: Object.keys(answers).map((questionId) => ({
          questionId: Number(questionId),
          value: answers[Number(questionId)],
        })),
      });
      navigate(`/templates/${templateId}/forms`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>Fill Out Form</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div
            key={question.id}
            className='mb-4'>
            <label className='block text-lg font-semibold mb-2'>
              {question.text}
            </label>
            <input
              type='text'
              className='border p-2 rounded w-full'
              onChange={(e) => handleChange(question.id, e.target.value)}
            />
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

export default FormCreation;
