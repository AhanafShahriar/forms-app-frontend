import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  role: string;
}

interface Template {
  id: number;
  title: string;
  author: string;
}
const apiUrl = process.env.REACT_APP_API_URL;
const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUsersAndTemplates = async () => {
      try {
        const usersResponse = await axios.get<User[]>(`${apiUrl}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);

        const templatesResponse = await axios.get<Template[]>(
          `${apiUrl}/templates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTemplates(templatesResponse.data);

        const currentUserResponse = await axios.get<User>(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(currentUserResponse.data);
      } catch (error) {
        console.error("Error fetching users or templates:", error);
      }
    };

    if (token) {
      fetchUsersAndTemplates();
    }
  }, []);

  const blockUser = (id: number) => {
    // Block user implementation
  };

  const deleteUser = (id: number) => {
    // Delete user implementation
  };

  const handleAdminSelfRemoval = (user: User) => {
    if (currentUser?.id === user.id && user.role !== "ADMIN") {
      alert(
        "You are about to remove your own admin access. Proceed with caution."
      );
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== "ADMIN" ? (
                  <>
                    <button onClick={() => blockUser(user.id)}>Block</button>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </>
                ) : (
                  <button onClick={() => handleAdminSelfRemoval(user)}>
                    Remove Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Templates</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.id}</td>
              <td>{template.title}</td>
              <td>{template.author}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
