import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TagsInput from "../components/TagsInput";
import QuestionManagerEdit, { Question } from "./QuestionManagerEdit";
import UserSelection, { User } from "../components/UserSelection";

const predefinedTopics = ["Education", "Quiz", "Other"];

interface Template {
  id: string;
  title: string;
  description: string;
  author: { id: string; name: string };
  createdAt: string;
  topic: string;
  tags: { name: string }[];
  questions: Question[];
  isPublic: boolean;
  allowedUsers: User[];
}
const apiUrl = process.env.REACT_APP_API_URL;
const TemplateEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [template, setTemplate] = useState<Template | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allowedUsers, setAllowedUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [restrictedAccess, setRestrictedAccess] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  // Fetch the template details
  // Fetch the template details
  useEffect(() => {
    const fetchTemplate = async () => {
      setLoadingTemplate(true);
      try {
        const response = await axios.get<Template>(`${apiUrl}/templates/${id}`);
        console.log("Fetched template response:", response.data); // Log the response
        setTemplate(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setTopic(response.data.topic);
        setTags(response.data.tags.map((tag) => tag.name));
        setQuestions(response.data.questions);
        setAllowedUsers(
          Array.isArray(response.data.allowedUsers)
            ? response.data.allowedUsers
            : []
        ); // Ensure this is set correctly
        setIsPublic(response.data.isPublic); // Correctly use 'public'
        setRestrictedAccess(
          Array.isArray(response.data.allowedUsers) &&
            response.data.allowedUsers.length > 0 &&
            !response.data.isPublic // Correctly use 'public'
        );
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoadingTemplate(false);
      }
    };

    fetchTemplate();
  }, [id]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }

      setLoadingUsers(true);
      try {
        const response = await axios.get<User[]>(`${apiUrl}/user/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Show loading state while fetching template or users
  if (loadingTemplate || loadingUsers) {
    return <p>Loading...</p>;
  }

  // Handle template update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User might not be logged in.");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/templates/${id}`,
        {
          title,
          description,
          topic,
          tags: tags.map((tag) => tag),
          questions,
          isPublic,
          allowedUsers: restrictedAccess
            ? allowedUsers.map((user) => user.id)
            : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/templates/${id}`);
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  if (!template) {
    return <p>Loading...</p>;
  }

  const isAuthor = currentUser && currentUser.id === template.author.id;

  if (!isAuthor) {
    return <p>You are not authorized to edit this template.</p>;
  }

  return (
    <div className='mt-10 mb-10 max-w-2xl mx-auto p-10 bg-white shadow-2xl rounded-lg'>
      <h2 className='text-2xl text-center font-bold mb-4'>Edit Template</h2>
      <form
        onSubmit={handleUpdate}
        className='space-y-4'>
        <div className='mb-4'>
          <label className='block text-lg font-semibold mb-2'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-lg font-semibold mb-2'>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-lg font-semibold mb-2'>Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded'>
            <option
              value=''
              disabled>
              Select a topic
            </option>
            {predefinedTopics.map((topic) => (
              <option
                key={topic}
                value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label className='block text-lg font-semibold mb-2'>Tags</label>
          <TagsInput
            tags={tags}
            allTags={[]}
            onAddTag={(tag: string) =>
              setTags((prevTags) => [...prevTags, tag])
            }
            onDeleteTag={(tag: string) =>
              setTags((prevTags) => prevTags.filter((t) => t !== tag))
            }
          />
        </div>

        <div className='mb-4'>
          <label className='block text-lg font-semibold mb-2'>Questions</label>
          <QuestionManagerEdit
            questions={questions}
            onAddQuestion={(q: Question) =>
              setQuestions((prevQuestions) => [...prevQuestions, q])
            }
            onDeleteQuestion={(id: string) =>
              setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q.id !== id)
              )
            }
            onQuestionChange={(id: string, field: keyof Question, value: any) =>
              setQuestions((prevQuestions) =>
                prevQuestions.map((q) =>
                  q.id === id ? { ...q, [field]: value } : q
                )
              )
            }
          />
        </div>

        <div className='flex items-center mt-4'>
          <input
            type='checkbox'
            checked={restrictedAccess}
            onChange={(e) => {
              setRestrictedAccess(e.target.checked);
              if (e.target.checked) {
                setIsPublic(false);
              }
            }}
            className='mr-2'
          />
          <label className='font-semibold'>
            Restricted Access (Select User)
          </label>
        </div>

        {restrictedAccess && (
          <UserSelection
            users={allUsers}
            selectedUsers={allowedUsers}
            onUserToggle={(user: User) => {
              setAllowedUsers((prev) =>
                prev.includes(user)
                  ? prev.filter((u) => u.id !== user.id)
                  : [...prev, user]
              );
            }}
          />
        )}

        <div className='flex items-center mt-4'>
          <input
            type='checkbox'
            checked={isPublic}
            onChange={(e) => {
              setIsPublic(e.target.checked);
              if (e.target.checked) {
                setRestrictedAccess(false);
                setAllowedUsers([]);
              }
            }}
            className='mr-2'
          />
          <label className='font-semibold'>Make template public</label>
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded'>
          Update Template
        </button>
      </form>
    </div>
  );
};

export default TemplateEdit;
