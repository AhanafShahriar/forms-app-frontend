import React, { useEffect, useState } from "react";

interface Comment {
  id: number;
  content: string;
  userId: number;
  // Add additional fields as needed
}

const Comments: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/templates/${templateId}/comments`);
      const data = await response.json();
      setComments(data);
    };

    fetchComments();
  }, [templateId]);

  const handleCommentSubmit = async () => {
    const response = await fetch(`/api/templates/${templateId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (response.ok) {
      // Refresh comments after posting
      setNewComment("");
      const updatedComments = await response.json();
      setComments(updatedComments);
    }
  };

  return (
    <div>
      <h4>Comments</h4>
      <div>
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>{comment.content}</p>
            {/* Additional comment details */}
          </div>
        ))}
      </div>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder='Add a comment'
      />
      <button onClick={handleCommentSubmit}>Submit</button>
    </div>
  );
};

export default Comments;
