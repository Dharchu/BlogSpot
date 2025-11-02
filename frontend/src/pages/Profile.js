import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: "Bearer " + token },
      });
      console.log("Profile data:", res.data);
      setUser(res.data);
      setName(res.data.name);
      setBio(res.data.bio || "");
    } catch (err) {
      console.error("❌ Error fetching profile:", err.response?.data || err.message);
      alert("Failed to load profile. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  // File upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  // Save profile
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        { name, bio, imageBase64 },
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("Profile updated successfully!");
      setUser(res.data);
      setImageBase64("");
    } catch (err) {
      console.error("❌ Error updating profile:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Loading screen
  if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading...</div>;

  // If no user data
  if (!user) return <div style={{ textAlign: "center" }}>No profile data found</div>;

  // UI
  return (
    <div style={{ maxWidth: 500, margin: "40px auto", textAlign: "center" }}>
      <h2>My Profile</h2>

      <img
        src={imageBase64 || user.avatar || "https://via.placeholder.com/100"}
        alt="avatar"
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: 10,
        }}
      />

      <form onSubmit={saveProfile}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          style={{ width: "100%", marginTop: 10 }}
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Enter bio"
          style={{ width: "100%", marginTop: 10 }}
        />
        <br />
        <button type="submit" style={{ marginTop: 10 }}>
          Save Profile
        </button>
      </form>
    </div>
  );
}
