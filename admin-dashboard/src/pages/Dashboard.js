// admin-dashboard/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // helper for auth header
  function auth() {
    const t = localStorage.getItem('token');
    return t ? { Authorization: 'Bearer ' + t } : {};
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // fetch users
        const u = await axios.get(`${API_URL}/api/admin/users`, { headers: auth() });
        // API might return { total, users } or an array; normalize
        const usersData = Array.isArray(u.data) ? u.data : (u.data.users || u.data || []);
        setUsers(usersData);

        // fetch posts
        const p = await axios.get(`${API_URL}/api/admin/posts`, { headers: auth() });
        // API might return an array or { total, posts }
        const postsData = Array.isArray(p.data) ? p.data : (p.data.posts || p.data || []);
        setPosts(postsData);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setUsers([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // safe aggregate: always operate on array
  const postsArray = Array.isArray(posts) ? posts : [];
  const totalComments = postsArray.reduce((acc, p) => acc + (p.comments?.length || 0), 0);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div className="card" style={cardStyle}>
          <div>Total Users</div>
          <div style={countStyle}>{Array.isArray(users) ? users.length : 0}</div>
        </div>

        <div className="card" style={cardStyle}>
          <div>Total Posts</div>
          <div style={countStyle}>{postsArray.length}</div>
        </div>

        <div className="card" style={cardStyle}>
          <div>Total Comments</div>
          <div style={countStyle}>{totalComments}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Recent Posts</h3>

        {postsArray.length > 0 ? (
          postsArray.slice(0, 5).map((p) => (
            <div key={p._id || p.id || Math.random()} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <strong>{p.title}</strong>
              <div style={{ color: '#555', fontSize: 13 }}>by {p.author?.name || 'Unknown'}</div>
            </div>
          ))
        ) : (
          <div style={{ padding: 8, color: '#888' }}>No posts available</div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  flex: 1,
  padding: 16,
  border: '1px solid #ddd',
  borderRadius: 10,
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  background: '#fff',
};

const countStyle = {
  fontSize: 26,
  fontWeight: 700,
  marginTop: 6,
};
