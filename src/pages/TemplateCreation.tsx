import React, { useState, useEffect } from "react";
import axios from "axios";

import TagsInput from "../components/TagsInput";
import UserSelection, { User } from "../components/UserSelection";
import QuestionManager, { Question } from "../components/QuestionManager";
import { DropResult } from "react-beautiful-dnd";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;
type Tag = { name: string };
const predefinedTopics = ["Education", "Quiz", "Other"];
console.log(apiUrl);
const TemplateCreation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [restrictedAccess, setRestrictedAccess] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());
  const [topic, setTopic] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [publicTemplate, setPublicTemplate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) {
      setError("No file selected");
      return;
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file); //cloudinary
    formData.append("upload_preset", "forms-app-preset");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dyqj17mub/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const secure_url = (response.data as { secure_url: string }).secure_url;
      setImageUrl(secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Error uploading image. Please try again.");
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get<Tag[]>(`${apiUrl}/templates/tags`);
      setAllTags(response.data.map((tag) => tag.name));
    } catch (error) {
      console.error("Error fetching tags:", error);
      setError("Error fetching tags. Please try again.");
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<User[]>(`${apiUrl}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllUsers(response.data);
    } catch (error) {
      setErrorUsers("Error fetching users. Please try again.");
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchUsers();
    if (currentUser) {
      setUserName(currentUser.name);
    }
    console.log(apiUrl);
  }, [currentUser]);

  const handleQuestionChange = (
    id: string,
    field: keyof Question,
    value: any
  ) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSubmit = async () => {
    if (!title || !description || !topic || questions.length === 0) {
      setError(
        "Title, description, topic, and at least one question are required."
      );
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);

    const token = localStorage.getItem("token");
    const templateData = {
      title,
      description,
      topic,
      tags,
      public: publicTemplate,
      selectedUsers: publicTemplate ? [] : selectedUsers.map((user) => user.id),
      user: userName,
      date,
      questions: questions.map(
        ({ id, title, description, type, displayedInTable, options }) => ({
          id,
          title,
          description,
          type,
          displayedInTable,
          options: type === "CHECKBOX" ? options : undefined,
        })
      ),
      imageUrl: imageUrl,
    };
    console.log("Template data being sent:", templateData);
    try {
      await axios.post(`${apiUrl}/templates`, templateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
      navigate("/", { state: { refresh: true } });
    } catch (err) {
      const error = err as any;
      if (error.response) {
        console.error("Error response:", error.response.data);
        setError(error.response.data.message || "An error occurred.");
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setSelectedUsers([]);
    setQuestions([]);
    setPublicTemplate(true);
    setImage(null);
    setImageUrl(null);
  };

  const isFormValid = title && description && questions.length > 0;

  return (
    <div className='bg-gray-100'>
      <div className='flex items-center justify-center rounded'>
        <div
          className='p-12 m-12 bg-white rounded-md shadow-md w-3/5 
                md:w-1/2 lg:w-3/5 xl:w-1/3'>
          <h1 className='text-xl text-center font-bold mb-4'>
            Create Template
          </h1>

          {error && <p className='text-red-500'>{error}</p>}
          {success && (
            <p className='text-green-500'>Template created successfully!</p>
          )}
          <div className='mb-4'>
            <label className='block text-lg font-semibold mb-2'>Author</label>
            <input
              type='text'
              value={userName}
              disabled
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-lg font-semibold mb-2'>Date</label>
            <input
              type='text'
              value={date}
              disabled
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-lg font-semibold mb-2'>Title</label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Enter template title'
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
              placeholder='Enter template description'
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
            <label className='block text-lg font-semibold mb-2'>
              Upload Image
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
          {imageUrl && (
            <img
              src={imageUrl}
              alt='Uploaded'
              className='mt-2'
            />
          )}
          <h2 className='text-xl font-semibold mt-4'>Tags</h2>
          <TagsInput
            tags={tags}
            allTags={allTags}
            onAddTag={(tag: string) =>
              setTags((prevTags) => [...prevTags, tag])
            }
            onDeleteTag={(tag: string) =>
              setTags((prevTags) => prevTags.filter((t) => t !== tag))
            }
          />

          <h2 className='text-xl font-semibold mt-2 '>Questions</h2>
          <QuestionManager
            questions={questions}
            onAddQuestion={(q: Question) =>
              setQuestions((prevQuestions) => [...prevQuestions, q])
            }
            onDeleteQuestion={(id: string) =>
              setQuestions((prevQuestions) =>
                prevQuestions.filter((q) => q.id !== id)
              )
            }
            onQuestionChange={handleQuestionChange}
          />

          <div className='flex items-center mt-4'>
            <input
              type='checkbox'
              checked={restrictedAccess}
              onChange={(e) => {
                setRestrictedAccess(e.target.checked);
                if (e.target.checked) {
                  setPublicTemplate(false);
                }
              }}
              className='mr-2'
            />
            <label className='font-semibold'>
              Restricted Access (Select User)
            </label>
          </div>

          {restrictedAccess && (
            <>
              {loadingUsers ? (
                <p>Loading users...</p>
              ) : errorUsers ? (
                <p className='text-red-500'>{errorUsers}</p>
              ) : (
                <UserSelection
                  users={allUsers}
                  selectedUsers={selectedUsers}
                  onUserToggle={(user: User) => {
                    setSelectedUsers((prev) =>
                      prev.includes(user)
                        ? prev.filter((u) => u.id !== user.id)
                        : [...prev, user]
                    );
                  }}
                />
              )}
            </>
          )}

          <div className='flex items-center mt-4'>
            <input
              type='checkbox'
              checked={publicTemplate}
              onChange={(e) => {
                setPublicTemplate(e.target.checked);
                if (e.target.checked) {
                  setRestrictedAccess(false);
                  setSelectedUsers([]);
                }
              }}
              className='mr-2'
            />
            <label className='font-semibold'>Make template public</label>
          </div>

          <button
            onClick={handleSubmit}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ${
              loading || !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || !isFormValid}>
            {loading ? "Creating..." : "Create Template"}
          </button>

          <button
            onClick={resetForm}
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4'>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreation;
