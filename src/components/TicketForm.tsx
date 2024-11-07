import React, { useState } from "react";
import axios from "axios";

// Define the types for the props
interface TicketFormProps {
  templateTitle: string;
  pageLink: string;
}

// Define the response type
interface TicketResponse {
  ticketUrl: string;
}
const apiUrl = process.env.REACT_APP_API_URL;
const TicketForm: React.FC<TicketFormProps> = ({ templateTitle, pageLink }) => {
  const [summary, setSummary] = useState<string>("");
  const [priority, setPriority] = useState<string>("Low");
  const [error, setError] = useState<string>("");
  const [ticketUrl, setTicketUrl] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Retrieve the token from local storage (or wherever you're storing it)
    const token = localStorage.getItem("token"); // Adjust this according to your storage method

    try {
      const response = await axios.post<TicketResponse>(
        `${apiUrl}/api/tickets/create-ticket`,
        {
          summary,
          priority,
          templateTitle,
          pageLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      setTicketUrl(response.data.ticketUrl);
    } catch (err) {
      setError("Failed to create ticket");
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className='max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white'>
      <h2 className='text-2xl font-bold mb-4'>Create Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Summary:
          </label>
          <input
            type='text'
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Priority:
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300'>
            <option value='High'>High</option>
            <option value='Medium'>Average</option>
            <option value='Low'>Low</option>
          </select>
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200'>
          Create Ticket
        </button>
      </form>
      {error && <p className='mt-4 text-red-500'>{error}</p>}
      {ticketUrl && (
        <p className='mt-4'>
          Ticket created! View it{" "}
          <a
            href={ticketUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'>
            here
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default TicketForm;
