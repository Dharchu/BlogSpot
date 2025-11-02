import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      fetchPost();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

 const handleComment = async () => {
  if (!text.trim()) return;
  setPosting(true);
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/posts/${id}/comment`,
      { text },
      { headers: { Authorization: "Bearer " + token } }
    );

    // ✅ Update full post with new one from server
    setPost(res.data.post);
    setText("");
  } catch (err) {
    console.error("Error posting comment:", err);
  } finally {
    setPosting(false);
  }
};

  if (loading) return <div className="card">Loading...</div>;
  if (!post) return <div className="card">Post not found</div>;

  return (
    <div className="card" style={{ maxWidth: 900, margin: "16px auto" }}>
      {post.image && (
        <img
          src={post.image}
          alt=""
          style={{
            width: "100%",
            height: 320,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}
      <h1 style={{ marginTop: 12 }}>{post.title}</h1>
      <div style={{ color: "#64748b", fontSize: 13 }}>
        {post.user?.username || "Unknown Author"} ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </div>

      <div
        style={{ marginTop: 12 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button className="btn" onClick={handleLike}>
          Like ({post.likes?.length || 0})
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Comments</h3>
        <div style={{ marginTop: 8 }}>
          {post.comments?.length ? (
            post.comments.map((c, i) => (
              <div
                key={c._id || i}
                style={{
                  padding: 10,
                  background: "#f8fafc",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {c.user?.username || "User"}
                </div>
                <div style={{ marginTop: 6 }}>{c.text}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 6,
                  }}
                >
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="input"
            disabled={posting}
          />
          <button className="btn" onClick={handleComment} disabled={posting}>
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
