import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../contexts/AuthContext";

// Define the Template and Option types
interface Option {
  id: string;
  value: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  type: string;
  options?: Option[];
}

interface Template {
  id: string;
  title: string;
  description: string;
  author: { id: string; name: string };
  createdAt: string;
  topic: string;
  tags: { name: string }[];
  questions: Question[];
  likes: { id: string; userId: string }[];
  imageUrl?: string;
}
const apiUrl = process.env.REACT_APP_API_URL;
const TemplateDetail = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { currentUser } = useAuth();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get<Template>(
          `${apiUrl}/templates/${templateId}`
        );
        console.log("Fetched template data:", response.data);
        setTemplate(response.data);
      } catch (err) {
        setError("Error fetching template details.");
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const handleLike = async () => {
    try {
      await axios.post(`${apiUrl}/templates/${templateId}/like`);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking template:", error);
    }
  };

  if (loading) return <p className='mt-5 ml-5'>Loading...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;

  if (!template) {
    return <p>No template found.</p>;
  }

  const totalLikes = template.likes ? template.likes.length : 0;
  const isAuthor = currentUser && currentUser.id === template.author.id;

  return (
    <div className='mt-10 max-w-2xl mx-auto p-10 bg-white shadow-2xl rounded-lg'>
      <h1 className='text-xl text-center font-bold mb-4'>{template.title}</h1>

      <p className='text-lg mb-4'>{template.description}</p>
      <p className='font-semibold mb-1'>
        Author: <span className='font-medium'>{template.author.name}</span>
      </p>
      <p className='font-semibold mb-1'>
        <span className='font-semibold'>Created At: </span>{" "}
        <span className='font-medium'>
          {new Date(template.createdAt).toLocaleDateString()}
        </span>
      </p>
      <p className='font-semibold mb-1'>
        Topic: <span className='font-medium'>{template.topic}</span>
      </p>
      <p className='font-semibold'>
        Tags:{" "}
        <span className='font-medium'>
          {template.tags
            ? template.tags.map((tag: { name: string }) => tag.name).join(", ")
            : "No tags"}
        </span>
      </p>

      <h2 className='text-xl font-semibold mt-5 mb-4'>Questions</h2>
      <ul className='list-disc pl-5 mb-5'>
        {template.questions && template.questions.length > 0 ? (
          template.questions.map((question: Question) => (
            <li
              key={question.id}
              className='mb-3'>
              <h3 className='font-semibold'>{question.title}</h3>-{" "}
              {question.description}
              {question.type === "CHECKBOX" && question.options && (
                <div className='mt-2'>
                  {question.options.map((option: Option) => (
                    <label
                      key={option.id}
                      className='block'>
                      <input
                        type='checkbox'
                        disabled
                        className='mr-2'
                      />
                      {option.value}
                    </label>
                  ))}
                </div>
              )}
            </li>
          ))
        ) : (
          <li>No questions available.</li>
        )}
      </ul>

      {template.imageUrl && (
        <div>
          <h3 className='font-semibold'>Image</h3>
          <img
            src={template.imageUrl}
            alt='Template'
            className='mt-4 w-full h-64 object-scale-down rounded-md  shadow-md'
          />
        </div>
      )}

      <p className='font-semibold mt-4'>Total Likes: {totalLikes}</p>

      <button
        className={`flex items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-1 px-2 rounded mt-4 ${
          liked ? "bg-green-500 hover:bg-green-700" : ""
        }`}
        onClick={handleLike}>
        <FontAwesomeIcon
          icon={liked ? solidHeart : regularHeart}
          className='h-4 w-4'
        />
        <span>{liked ? "Unlike" : "Like"}</span>
      </button>

      {currentUser && (
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4'
          onClick={() => navigate(`/forms/${templateId}/fill`)}>
          Fill Form
        </button>
      )}

      {isAuthor && (
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4'
          onClick={() => navigate(`/templates/edit/${templateId}`)}>
          Edit Template
        </button>
      )}
      {isAuthor && (
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4'
          onClick={() => navigate(`/templates/${templateId}/forms`)}>
          Forms List
        </button>
      )}

      {templateId && (
        <Comments
          templateId={templateId}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default TemplateDetail;
