import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Template {
  id: number;
  title: string;
  questions: { id: number; question: string }[];
}
const apiUrl = process.env.API_URL;
const FormSubmission: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: number; value: string }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get<Template>(
          `${apiUrl}/api/templates/${templateId}`
        );
        setTemplate(response.data);
        setAnswers(
          response.data.questions.map((question) => ({
            questionId: question.id,
            value: "",
          }))
        );
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId ? { ...answer, value } : answer
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/forms`, { templateId, answers });
      alert("Form submitted successfully!");
      navigate("/user/personal");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!template) return <div>Loading...</div>;

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-4'>{template.title}</h2>
      <form onSubmit={handleSubmit}>
        {template.questions.map((question) => (
          <div
            key={question.id}
            className='mb-4'>
            <label className='block text-sm font-medium mb-2'>
              {question.question}
            </label>
            <input
              type='text'
              value={
                answers.find((answer) => answer.questionId === question.id)
                  ?.value || ""
              }
              onChange={(e) => handleChange(question.id, e.target.value)}
              className='border p-2 w-full'
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

export default FormSubmission;
