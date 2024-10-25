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
  users: { id: string; name: string }[];
  imageUrl?: string;
}
const apiUrl = process.env.REACT_API_URL;
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;

  if (!template) {
    return <p>No template found.</p>;
  }

  const totalLikes = template.likes ? template.likes.length : 0;
  const isAuthor = currentUser && currentUser.id === template.author.id;

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
      <h1 className='text-xl text-center font-bold mb-4'>{template.title}</h1>

      {error && <p className='text-red-500'>{error}</p>}
      <p className='text-lg mb-2'>{template.description}</p>
      <p className='font-semibold'>Author: {template.author.name}</p>
      <p className='font-semibold'>
        Created At: {new Date(template.createdAt).toLocaleDateString()}
      </p>
      <p className='font-semibold'>Topic: {template.topic}</p>
      <p className='font-semibold'>
        Tags:{" "}
        {template.tags
          ? template.tags.map((tag: { name: string }) => tag.name).join(", ")
          : "No tags"}
      </p>
      <p className='font-semibold'>
        Users:{" "}
        {template.users
          ? template.users.map((user: any) => user.name).join(", ")
          : "No users"}
      </p>

      <h2 className='text-xl font-semibold mt-4'>Questions</h2>
      <ul className='list-disc pl-5 mb-4'>
        {template.questions && template.questions.length > 0 ? (
          template.questions.map((question: Question) => (
            <li key={question.id}>
              <strong>{question.title}</strong>: {question.description}
              {question.type === "CHECKBOX" &&
                question.options && ( // Change to "CHECKBOX"
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
        <img
          src={template.imageUrl}
          alt='Template'
          className='mt-4 w-full h-64 object-cover rounded-md'
        />
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

      {isAuthor && (
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
          onClick={() => navigate(`/templates/edit/${templateId}`)}>
          Edit Template
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
