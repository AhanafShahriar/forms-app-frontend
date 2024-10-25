import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: number;
  content: string;
  userId: number;
}

interface User {
  id: string;
  name: string;
}

const Comments: React.FC<{ templateId: string; currentUser: User | null }> = ({
  templateId,
  currentUser,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(
        `/templates/${templateId}/comments`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();

    const intervalId = setInterval(() => {
      fetchComments();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [templateId]);

  const handleCommentSubmit = async () => {
    if (!newComment) return;
    try {
      await axios.post(`/templates/${templateId}/comments`, {
        content: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className='mt-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md'>
      <h4 className='text-lg font-semibold mb-2'>Comments</h4>
      {currentUser ? (
        <>
          <div className='max-h-60 overflow-y-auto mb-4'>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className='border-b border-gray-200 py-2'>
                  <p className='text-gray-800'>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No comments yet.</p>
            )}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Add a comment...'
            className='w-full border border-gray-300 rounded-lg p-2 mb-2'
            rows={3}
          />
          <button
            onClick={handleCommentSubmit}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Submit
          </button>
        </>
      ) : (
        <p className='text-gray-500'>
          Login to see previous comments and add new ones.
        </p>
      )}
    </div>
  );
};

export default Comments;
