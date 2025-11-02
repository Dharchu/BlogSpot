import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: '' });

  function auth() {
    const t = localStorage.getItem('token');
    return t ? { Authorization: 'Bearer ' + t } : {};
  }

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/admin/posts', {
        headers: auth(),
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setPosts(data);
    } catch (err) {
      console.error('Posts fetch error:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function deletePost(id) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/posts/${id}`, {
        headers: auth(),
      });
      alert('Post deleted successfully');
      fetchPosts();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete post');
    }
  }

  function startEdit(post) {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      content: post.content || '',
      category: post.category || '',
    });
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/admin/posts/${editingPost._id}`,
        form,
        { headers: auth() }
      );
      alert('Post updated successfully');
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update post');
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading posts...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 10 }}>Manage Posts</h2>

      {editingPost && (
        <form
          onSubmit={saveEdit}
          style={{
            marginBottom: 20,
            padding: 15,
            border: '1px solid #ccc',
            borderRadius: 8,
            background: '#fafafa',
          }}
        >
          <h3>Edit Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
          <textarea
            placeholder="Content"
            rows="4"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              style={{
                background: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingPost(null)}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <div style={{ color: '#888' }}>No posts found</div>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <thead style={{ background: '#f4f4f4' }}>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Author</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id || p.id}>
                <td style={tdStyle}>{p.title}</td>
                <td style={tdStyle}>{p.category || 'General'}</td>
                <td style={tdStyle}>{p.author?.name || 'Unknown'}</td>
                <td style={tdStyle}>
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : '—'}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => startEdit(p)}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      marginRight: 8,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(p._id || p.id)}
                    style={{
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: 10,
  borderBottom: '1px solid #ddd',
  fontWeight: '600',
};

const tdStyle = {
  padding: 10,
  borderBottom: '1px solid #eee',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  marginBottom: 10,
  padding: 8,
  borderRadius: 6,
  border: '1px solid #ccc',
};
