import React, { useEffect, useState } from "react";
import axios from "axios";

interface CreateAccountFormProps {
  onClose: () => void;
}
const apiUrl = process.env.REACT_APP_API_URL;
const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ onClose }) => {
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("userName") || "";
    const userEmail = localStorage.getItem("userEmail") || "";

    console.log("Fetched from local storage:", { userName, userEmail });

    setAccountName(userName);
    setAccountEmail(userEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${apiUrl}/user/accounts`,
        {
          accountName,
          accountEmail,
          contactName,
          contactEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Account and Contact created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create Account and Contact.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='p-4 bg-white shadow-md rounded-lg'>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Account Name:
        </label>
        <input
          type='text'
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
          className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Account Email:
        </label>
        <input
          type='email'
          value={accountEmail}
          onChange={(e) => setAccountEmail(e.target.value)}
          required
          className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Contact Name:
        </label>
        <input
          type='text'
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          required
          className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>
          Contact Email:
        </label>
        <input
          type='email'
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
          className='mt-1 block w-full border border-gray-300 rounded-md p -2 focus:ring focus:ring-blue-500'
        />
      </div>
      <div className='flex justify-between'>
        <button
          type='submit'
          className='bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600'>
          Create Account
        </button>
        <button
          type='button'
          onClick={onClose}
          className='bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400'>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateAccountForm;
