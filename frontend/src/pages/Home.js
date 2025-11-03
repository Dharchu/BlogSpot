import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(Array.isArray(res.data) ? res.data : []);
      const dynamicCats = Array.from(new Set(res.data.map(p => p.category || 'General')));
      const predefinedCats = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Business'];
      const allCats = Array.from(new Set([...predefinedCats, ...dynamicCats]));
      setCategories(allCats);
    } catch (e) {
      console.error('Error fetching posts:', e);
    }
  }

  const filtered = posts.filter(p => {
    const matchesQ =
      q === '' ||
      (p.title + ' ' + (p.content || '')).toLowerCase().includes(q.toLowerCase());
    const matchesCat = !category || p.category === category;
    return matchesQ && matchesCat;
  });

  return (
    <div>
      <div
        className="card"
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <input
          className="input"
          placeholder="Search posts by title or content..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ maxWidth: 520 }}
        />
        <select
          className="input"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ width: 180 }}
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          gap: 16,
        }}
      >
        {filtered.map(p => (
          <article
            key={p._id}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {p.image && (
              <Link to={'/post/' + p._id}>
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </Link>
            )}
            <div>
              <Link
                to={'/post/' + p._id}
                style={{ textDecoration: 'none', color: '#0f172a' }}
              >
                <h3
                  style={{ margin: '6px 0', fontSize: 18, fontWeight: 700 }}
                >
                  {p.title}
                </h3>
              </Link>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 8,
              }}
            >              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="category-badge">
                  {p.category || 'General'}
                </div>
                <div style={{ color: '#64748b', fontSize: 13 }}>
                  {p.author?.name || 'Unknown'}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  color: '#475569',
                }}
              >
                <div>❤ {p.likes?.length || 0}</div>
                <div>💬 {p.comments?.length || 0}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// helper to remove html tags
function stripHtml(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
}
