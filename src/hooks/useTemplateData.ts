import { useState, useEffect } from "react";
import axios from "axios";

// Define types
type Tag = { name: string };
type User = { id: string; name: string };
// Inside the useTemplateData hook
export const useTemplateData = () => {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchTags = async () => {
    try {
      const response = await axios.get<Tag[]>("/templates/tags");
      setAllTags(response.data.map((tag) => tag.name));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("/users");
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Call the fetch functions inside useEffect to load data when the component mounts
  useEffect(() => {
    fetchTags();
    fetchUsers();
  }, []);

  return { allTags, allUsers };
};
