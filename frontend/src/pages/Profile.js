import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(null);
  // useMemo will prevent re-parsing on every render, stopping the infinite loop
  const user = useMemo(() => JSON.parse(localStorage.getItem('user')), []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchUserPosts() {
      if (!user?._id) return; // Don't fetch if user ID is missing
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/user/${user._id}`);
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching user posts:', err);
      } finally {
        setLoading(false); 
      }
    }

    fetchUserPosts();
  }, [user, navigate]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post.');
    }
  };

  if (loading) return <div className="card">Loading profile...</div>;

  return (
    <div className="card" style={{ maxWidth: 900, margin: '16px auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div className="profile-icon" style={{ width: 80, height: 80, fontSize: 36 }}>
          {user.name[0]?.toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: 0 }}>{user.name}</h1>
          <p style={{ margin: 0, color: '#64748b' }}>{user.email}</p>
        </div>
      </div>

      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p>You haven't created any posts yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map(post => (
            <div key={post._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
              <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600 }}>
                {post.title}
              </Link>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link 
                  to={`/create?edit=${post._id}`} 
                  className="btn-sm btn-secondary"
                  onMouseEnter={() => setHoveredButton(post._id)}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    ...editButtonStyle,
                    ...(hoveredButton === post._id && editButtonHoverStyle)
                  }}
                >
                  Edit
                </Link>
                <button onClick={() => handleDelete(post._id)} className="btn-sm btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const editButtonStyle = {
  textDecoration: 'none',
  color: '#fff',
  backgroundColor: '#6c757d', // A standard secondary button color
  transition: 'background-color 0.2s ease-in-out',
  // Replicating btn-sm styles
  padding: '0.25rem 0.5rem',
  fontSize: '0.875rem',
  borderRadius: '0.2rem',
  lineHeight: 1.5,
};

const editButtonHoverStyle = {
  backgroundColor: '#5a6268', // A darker shade for hover
};