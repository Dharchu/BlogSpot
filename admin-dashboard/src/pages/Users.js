import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  function auth() {
    const t = localStorage.getItem('token');
    return t ? { Authorization: 'Bearer ' + t } : {};
  }

  // ✅ Fetch all users from admin route
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", { headers: auth() });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete user by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers: auth() });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Error deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading users...</p>;
  if (users.length === 0) return <p className="text-center mt-4">No users found.</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manage Users</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
